import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface CsvUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CsvUploadModal = ({ open, onOpenChange }: CsvUploadModalProps) => {
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: async (csvFile: File) => {
            const formData = new FormData();
            formData.append("file", csvFile);

            const { data } = await api.post("/admin/analytics/upload-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "CSV uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["adminOverview"] });
            queryClient.invalidateQueries({ queryKey: ["executiveData"] });
            queryClient.invalidateQueries({ queryKey: ["adminStats"] });
            setFile(null);
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to upload CSV");
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
                        Import field executive tracking logs, sales data, or products via CSV.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
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
                        <div className="p-4 border border-border rounded-xl bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600 flex-shrink-0">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFile}
                                className="text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || mutation.isPending}
                        className="gap-2 bg-primary hover:bg-primary/90 text-white"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <UploadCloud className="h-4 w-4" />
                        )}
                        {mutation.isPending ? "Uploading..." : "Upload Data"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CsvUploadModal;
