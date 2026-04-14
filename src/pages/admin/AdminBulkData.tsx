import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, Filter, ArrowUp, ArrowDown, Database, UploadCloud, ChevronLeft, ChevronRight, X } from "lucide-react";
import BulkUploadModal from "@/components/admin/bulk/BulkUploadModal";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const AdminBulkData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const batchIdParam = searchParams.get("batchId");
    
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const { data: filters } = useQuery({
        queryKey: ["bulkFilters"],
        queryFn: async () => {
            const { data } = await api.get("/bulk/filters");
            return data;
        }
    });

    const { data: bulkData, isLoading } = useQuery({
        queryKey: ["bulkData", page, search, category, status, sortBy, sortOrder, batchIdParam],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
                search,
                sortBy,
                sortOrder
            });
            if (category !== "all") params.append("category", category);
            if (status !== "all") params.append("status", status);
            if (batchIdParam) params.append("batchId", batchIdParam);

            const { data } = await api.get(`/bulk/data?${params.toString()}`);
            return data;
        }
    });

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const handleExport = async () => {
        try {
            const params = new URLSearchParams({ search, category, status });
            if (batchIdParam) params.append("batchId", batchIdParam);
            const response = await api.get(`/bulk/export?${params.toString()}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `bulk_records_${format(new Date(), 'yyyyMMdd')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Export started");
        } catch (err) {
            toast.error("Failed to export data");
        }
    };

    const clearBatchFilter = () => {
        searchParams.delete("batchId");
        setSearchParams(searchParams);
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return null;
        return sortOrder === "asc" ? <ArrowUp className="h-3 w-3 inline ml-1" /> : <ArrowDown className="h-3 w-3 inline ml-1" />;
    };

    return (
        <DashboardLayout role={adminConfig}>
            <div className="space-y-6">
                <BulkUploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Database className="h-6 w-6 text-primary" />
                            {batchIdParam ? "Batch Data Records" : "Bulk Manager"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {batchIdParam ? `Viewing records for batch: ${batchIdParam}` : "Manage and analyze bulk uploaded product records"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                        <Button size="sm" className="gap-2" onClick={() => setIsUploadModalOpen(true)}>
                            <UploadCloud className="h-4 w-4" /> Upload New Data
                        </Button>
                    </div>
                </div>

                {batchIdParam && (
                    <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <Filter className="h-4 w-4 text-primary" />
                            <span>Currently filtering by Batch: <b className="font-mono text-primary">{batchIdParam}</b></span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearBatchFilter} className="h-8 gap-2 hover:bg-primary/20">
                            <X className="h-3 w-3" /> Clear Filter
                        </Button>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-card p-4 rounded-2xl border border-border shadow-card flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px] space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Product Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or vendor..."
                                className="pl-9 h-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-[180px] space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Category</label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {filters?.categories?.map((c: string) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-[150px] space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Status</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {filters?.statuses?.map((s: string) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('recordId')}>
                                        ID <SortIcon field="recordId" />
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('productName')}>
                                        Product <SortIcon field="productName" />
                                    </TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                                        Price <SortIcon field="price" />
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('quantity')}>
                                        Qty <SortIcon field="quantity" />
                                    </TableHead>
                                    <TableHead>Total Value</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('uploadedAt')}>
                                        Uploaded <SortIcon field="uploadedAt" />
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array(10).fill(0).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array(9).fill(0).map((_, j) => (
                                                <TableCell key={j}><div className="h-4 w-full bg-muted animate-pulse rounded" /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : bulkData?.data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-40 text-center text-muted-foreground">
                                            No records found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bulkData?.data?.map((row: any) => (
                                        <TableRow key={row._id} className="hover:bg-muted/10 transition-colors">
                                            <TableCell className="font-mono text-[11px]">{row.recordId || row._id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell className="font-medium">{row.productName}</TableCell>
                                            <TableCell className="text-muted-foreground">{row.category}</TableCell>
                                            <TableCell>₹{row.price.toLocaleString()}</TableCell>
                                            <TableCell>{row.quantity}</TableCell>
                                            <TableCell className="font-semibold text-primary">₹{row.totalValue.toLocaleString()}</TableCell>
                                            <TableCell className="text-muted-foreground">{row.vendor || "N/A"}</TableCell>
                                            <TableCell className="text-muted-foreground">{format(new Date(row.uploadedAt || row.createdAt), 'MMM dd, HH:mm')}</TableCell>
                                            <TableCell><StatusBadge status={row.status.toLowerCase()} /></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/10">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * 10, bulkData?.total || 0)}</span> of <span className="font-medium text-foreground">{bulkData?.total || 0}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="h-9 w-9 p-0">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1 mx-2">
                                {Array.from({ length: Math.min(5, bulkData?.pages || 1) }, (_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={page === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(i + 1)}
                                        className="h-9 w-9"
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>
                            <Button variant="outline" size="sm" disabled={page >= (bulkData?.pages || 1)} onClick={() => setPage(page + 1)} className="h-9 w-9 p-0">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminBulkData;
