import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Trash2, Eye, LayoutDashboard, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminBulkHistory = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [deletingBatch, setDeletingBatch] = useState<string | null>(null);

    const { data: batches, isLoading } = useQuery({
        queryKey: ["bulkBatches"],
        queryFn: async () => {
            const { data } = await api.get("/bulk/batches");
            return data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (batchId: string) => {
            await api.delete(`/bulk/batch/${batchId}`);
        },
        onSuccess: () => {
            toast.success("Batch deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["bulkBatches"] });
            queryClient.invalidateQueries({ queryKey: ["bulkData"] });
            queryClient.invalidateQueries({ queryKey: ["bulkReports"] });
            setDeletingBatch(null);
        },
        onError: () => {
            toast.error("Failed to delete batch");
            setDeletingBatch(null);
        }
    });

    const toggleMutation = useMutation({
        mutationFn: async (batchId: string) => {
            await api.patch(`/bulk/batch/${batchId}/toggle-report`);
        },
        onSuccess: () => {
            toast.success("Batch reporting updated");
            queryClient.invalidateQueries({ queryKey: ["bulkBatches"] });
            queryClient.invalidateQueries({ queryKey: ["bulkReports"] });
        }
    });

    return (
        <DashboardLayout role={adminConfig}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <History className="h-6 w-6 text-primary" />
                            Bulk Upload History
                        </h1>
                        <p className="text-sm text-muted-foreground">Manage your datasets and batch uploads</p>
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Batch ID</TableHead>
                                <TableHead>File Name</TableHead>
                                <TableHead>Records</TableHead>
                                <TableHead>Date Uploaded</TableHead>
                                <TableHead>In Reports?</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array(6).fill(0).map((_, j) => (
                                            <TableCell key={j}><div className="h-4 w-full bg-muted animate-pulse rounded" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : batches?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                                        No upload history found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                batches?.map((batch: any) => (
                                    <TableRow key={batch._id} className="hover:bg-muted/10">
                                        <TableCell className="font-mono text-xs font-bold text-primary">{batch._id}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{batch.fileName || "Unknown File"}</TableCell>
                                        <TableCell>{batch.recordCount.toLocaleString()}</TableCell>
                                        <TableCell className="text-muted-foreground">{format(new Date(batch.uploadedAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                                        <TableCell>
                                            <Switch 
                                                checked={batch.includeInReports} 
                                                onCheckedChange={() => toggleMutation.mutate(batch._id)}
                                                disabled={toggleMutation.isPending}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 gap-2"
                                                    onClick={() => navigate(`/admin/bulk?batchId=${batch._id}`)}
                                                >
                                                    <Eye className="h-4 w-4" /> View
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 text-destructive hover:bg-destructive/10 gap-2"
                                                    onClick={() => setDeletingBatch(batch._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={!!deletingBatch} onOpenChange={(open) => !open && setDeletingBatch(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Delete Dataset?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this batch? All records associated with this batch will be removed from the system and analytics. This action can be undone by an administrator.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => deletingBatch && deleteMutation.mutate(deletingBatch)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
};

export default AdminBulkHistory;
