import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { retailConfig } from "@/config/retailConfig";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { generatePDFBill } from "@/utils/generatePDFBill";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

const RetailOrderHistory = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/my");
      return data;
    },
  });

  const { data: outlet } = useQuery({
    queryKey: ["myOutlet"],
    queryFn: async () => {
      const { data } = await api.get("/outlets/mine");
      return data;
    },
    retry: false,
  });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const calculateMilletsProWeight = (order: any) => {
    let weightKg = 0;
    order.items?.forEach((item: any) => {
      const brandName = item.brandName || item.product?.brandId?.name || "";
      const w = item.weightInKg || (item.product?.weightInKg) || (item.product?.weight ? item.product.weight / 1000 : 0) || 0;
      if (brandName === "MilletsPro" || item.product?.brandId?.slug === "milletspro") {
        weightKg += w * item.quantity;
      }
    });
    return weightKg;
  };

  return (
    <DashboardLayout role={retailConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          <p className="text-sm text-muted-foreground">View past orders and download invoices</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">Error loading orders.</div>
        ) : (
          <DataTable
            columns={[
              { header: "Order ID", accessor: (row: any) => row._id?.slice(-6).toUpperCase() },
              { header: "Items", accessor: (row: any) => String(row.items?.length ?? 0) },
              { header: "Amount", accessor: (row: any) => `₹${row.totalAmount?.toLocaleString()}` },
              { header: "Status", accessor: (row: any) => <StatusBadge status={row.orderStatus || row.status || "Pending"} /> },
              { header: "Date", accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
              {
                header: "Actions",
                accessor: (row: any) =>
                  row._id ? (
                    <div className="flex items-center gap-2">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="gap-1 text-primary h-7"
                         onClick={() => setSelectedOrder(row)}
                       >
                         <Eye className="h-3 w-3" /> View
                       </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 text-primary h-7"
                        onClick={() => generatePDFBill(row, user?.name || "Retail Partner", outlet?.address)}
                      >
                        <Download className="h-3 w-3" /> PDF
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  ),
              },
            ]}
            data={data || []}
          />
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?._id?.slice(-6).toUpperCase()}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder ? new Date(selectedOrder.createdAt).toLocaleDateString() : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Billed To */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Billed To</h3>
                <p className="text-sm text-foreground">{user?.name || "Retail Partner"}</p>
                {(outlet?.address || selectedOrder.shippingAddress) && (
                  <div className="text-sm text-muted-foreground mt-1">
                    <p>{(outlet?.address || selectedOrder.shippingAddress).street}</p>
                    <p>{(outlet?.address || selectedOrder.shippingAddress).city}, {(outlet?.address || selectedOrder.shippingAddress).state} - {(outlet?.address || selectedOrder.shippingAddress).zipCode}</p>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Item Name</th>
                      <th className="px-4 py-2 text-center font-medium">Qty</th>
                      <th className="px-4 py-2 text-right font-medium">Unit Price</th>
                      <th className="px-4 py-2 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedOrder.items?.map((item: any, i: number) => {
                      const name = item.product?.name || item.name || "Unknown Product";
                      const qty = item.quantity || 1;
                      const price = item.unitPrice || item.product?.discountedPrice || 0;
                      const subtotal = item.subtotal || (price * qty);
                      
                      return (
                        <tr key={item._id || i}>
                          <td className="px-4 py-3">{name}</td>
                          <td className="px-4 py-3 text-center">{qty}</td>
                          <td className="px-4 py-3 text-right">₹{price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium">₹{subtotal.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{(selectedOrder.subtotal || selectedOrder.totalAmount + (selectedOrder.discountAmount || 0)).toLocaleString()}</span>
                  </div>
                  
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Discount ({selectedOrder.discountType === "FIRST_ORDER" ? "First Order" : "Promo"})</span>
                      <span>-₹{selectedOrder.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {calculateMilletsProWeight(selectedOrder) > 0 && (
                    <div className="flex justify-between text-muted-foreground border-t pt-2 mt-2">
                       <span>MilletsPro Weight Ordered</span>
                       <span>{calculateMilletsProWeight(selectedOrder).toFixed(2)} kg</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Final Total</span>
                    <span>₹{selectedOrder.totalAmount?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RetailOrderHistory;
