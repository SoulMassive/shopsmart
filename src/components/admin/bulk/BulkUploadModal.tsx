import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Papa from "papaparse";

interface BulkUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const REQUIRED_COLUMNS = ["RecordID", "ProductID", "ProductName", "Category", "Price", "Quantity", "DateAdded"];

const BulkUploadModal = ({ open, onOpenChange }: BulkUploadModalProps) => {
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: async (uploadFile: File) => {
            const formData = new FormData();
            formData.append("file", uploadFile);
            const { data } = await api.post("/bulk/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Data uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["bulkData"] });
            queryClient.invalidateQueries({ queryKey: ["bulkReports"] });
            handleClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to upload data");
        },
    });

    const handleClose = () => {
        setFile(null);
        setPreviewData([]);
        setErrors([]);
        onOpenChange(false);
    };

    const validateData = (data: any[]) => {
        const newErrors: string[] = [];
        if (data.length === 0) {
            newErrors.push("File is empty");
            return newErrors;
        }

        const headers = Object.keys(data[0]);
        const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
            newErrors.push(`Missing required columns: ${missingColumns.join(", ")}`);
        }

        data.slice(0, 100).forEach((row, idx) => {
            if (!row.ProductName) newErrors.push(`Row ${idx + 1}: ProductName is missing`);
            if (isNaN(Number(row.Price)) || Number(row.Price) <= 0) newErrors.push(`Row ${idx + 1}: Price must be > 0`);
            if (isNaN(Number(row.Quantity)) || Number(row.Quantity) < 0) newErrors.push(`Row ${idx + 1}: Quantity must be >= 0`);
        });

        return newErrors;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.size > 25 * 1024 * 1024) {
            toast.error("File size exceeds 25MB limit");
            return;
        }

        setFile(selectedFile);
        setIsValidating(true);

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setPreviewData(results.data.slice(0, 10));
                const validationErrors = validateData(results.data);
                setErrors(validationErrors);
                setIsValidating(false);
            },
            error: (err) => {
                toast.error("Error parsing CSV: " + err.message);
                setIsValidating(false);
            }
        });
    };

    const handleUpload = () => {
        if (!file) return;
        if (errors.length > 0) {
            toast.error("Please fix errors before uploading");
            return;
        }
        mutation.mutate(file);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Bulk Data Upload</DialogTitle>
                    <DialogDescription>
                        Upload your CSV or Excel file (Max 25MB). Required columns: {REQUIRED_COLUMNS.join(", ")}.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {!file ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors"
                        >
                            <div className="bg-primary/10 p-4 rounded-full">
                                <UploadCloud className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">Click or Drag & Drop to upload</p>
                                <p className="text-sm text-muted-foreground">CSV, XLSX up to 25MB</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.xlsx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 border border-border rounded-xl bg-card flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-10 w-10 text-primary" />
                                    <div>
                                        <p className="font-bold">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPreviewData([]); setErrors([]); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {isValidating ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Validating data...
                                </div>
                            ) : errors.length > 0 ? (
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-destructive font-semibold">
                                        <AlertCircle className="h-4 w-4" />
                                        Validation Errors
                                    </div>
                                    <ul className="text-xs text-destructive/80 list-disc list-inside">
                                        {errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                                        {errors.length > 5 && <li>...and {errors.length - 5} more errors</li>}
                                    </ul>
                                </div>
                            ) : (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Data validated and ready for upload
                                </div>
                            )}

                            {previewData.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold">Preview (First {previewData.length} rows)</p>
                                    <div className="border border-border rounded-xl overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    {Object.keys(previewData[0]).map(h => (
                                                        <TableHead key={h} className="text-[10px] uppercase font-bold">{h}</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {previewData.map((row, i) => (
                                                    <TableRow key={i}>
                                                        {Object.values(row).map((v: any, j) => (
                                                            <TableCell key={j} className="text-[10px] truncate max-w-[100px]">{String(v)}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-2 border-t border-border">
                    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || errors.length > 0 || mutation.isPending}
                        className="gap-2"
                    >
                        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Start Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BulkUploadModal;
