import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X, Loader2, Database, MapPin } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CsvUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type UploadType = "logs" | "products";

const CsvUploadModal = ({ open, onOpenChange }: CsvUploadModalProps) => {
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<UploadType>("products");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: async (csvFile: File) => {
            const formData = new FormData();
            formData.append("file", csvFile);

            // Select endpoint based on type
            const endpoint = type === "logs" 
                ? "/admin/analytics/upload-csv" 
                : "/products/import";

            const { data } = await api.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "CSV uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["executiveData"] });
            setFile(null);
            onOpenChange(false);
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to upload CSV";
            const detail = err.response?.data?.error ? `: ${err.response.data.error}` : "";
            toast.error(msg + detail);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.name.endsWith('.csv')) {
                toast.error("Please upload a valid CSV file");
                return;
            }
            setFile(selectedFile);
        }
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUpload = () => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }
        mutation.mutate(file);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload CSV Data</DialogTitle>
                    <DialogDescription>
                        Select the type of data you are importing to ensure correct processing.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-2 pb-4">
                    {/* Data Type Selection */}
                    <div className="space-y-3">
                        <Label>Import Type</Label>
                        <Select value={type} onValueChange={(val: UploadType) => setType(val)}>
                            <SelectTrigger className="w-full h-12">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="products">
                                    <div className="flex items-center gap-2">
                                        <Database className="h-4 w-4 text-orange-500" />
                                        <span>Product Catalog (Bulk Import)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="logs">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <span>Executive Tracking Logs (GPS)</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Dropzone */}
                    <div className="space-y-3">
                        <Label>File</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {!file ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-colors"
                            >
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <UploadCloud className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Click to select a CSV file</p>
                                    <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border border-border rounded-xl bg-primary/5 flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-primary p-2.5 rounded-lg text-white flex-shrink-0">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • CSV Document</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearFile}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || mutation.isPending}
                        className="gap-2 shadow-lg shadow-primary/20"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <UploadCloud className="h-4 w-4" />
                        )}
                        {mutation.isPending ? "Processing..." : "Import Data"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CsvUploadModal;
