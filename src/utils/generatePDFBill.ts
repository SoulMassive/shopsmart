import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDFBill = (order: any, userName: string, currentAddress?: any) => {
    const doc = new jsPDF();
    const orderId = order.orderNumber || order._id.slice(-6).toUpperCase();
    const date = new Date(order.createdAt).toLocaleDateString();

    // ── Header Section ──────────────────────────────────────────────
    // Add ShopsMart Title
    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34); // Forest Green
    doc.text("ShopsMart", 14, 20);

    // Document Title & Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Invoice / Bill", 14, 28);
    
    // Align Right for Invoice Details
    doc.text(`Order ID: ${orderId}`, 140, 20);
    doc.text(`Date: ${date}`, 140, 26);
    doc.text(`Status: ${order.orderStatus || order.status}`, 140, 32);

    // ── Customer Details ────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Billed To:", 14, 45);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Retailer: ${userName || "Retail Partner"}`, 14, 52);
    
    const addressToUse = currentAddress || order.shippingAddress;
    
    if (addressToUse) {
        doc.text(`${addressToUse.street}`, 14, 58);
        doc.text(`${addressToUse.city}, ${addressToUse.state} - ${addressToUse.zipCode}`, 14, 64);
    }

    // ── Items Table ──────────────────────────────────────────────────
    const tableColumn = ["Item Name", "Qty", "Unit Price", "Subtotal"];
    const tableRows: any[] = [];
    let milletsProWeightKg = 0;

    order.items?.forEach((item: any) => {
        // Handle populated products or direct embedded items depending on the API payload
        const name = item.product?.name || item.name || "Unknown Product";
        const qty = item.quantity || 1;
        const price = item.unitPrice || item.product?.discountedPrice || 0;
        const subtotal = item.subtotal || (price * qty);
        
        const brandName = item.brandName || item.product?.brandId?.name || "";
        const weightInKg = item.weightInKg || (item.product?.weightInKg) || (item.product?.weight ? item.product.weight / 1000 : 0) || 0;
        
        if (brandName === "MilletsPro" || item.product?.brandId?.slug === "milletspro") {
            milletsProWeightKg += weightInKg * qty;
        }

        tableRows.push([
            name,
            qty.toString(),
            `Rs. ${price.toLocaleString()}`,
            `Rs. ${subtotal.toLocaleString()}`
        ]);
    });

    autoTable(doc, {
        startY: 75,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [34, 139, 34] },
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // ── Financial Summary ────────────────────────────────────────────
    const finalY = (doc as any).lastAutoTable.finalY || 80;
    
    doc.setFontSize(10);
    doc.setTextColor(50);
    
    // Subtotal
    const subtotal = order.subtotal || order.totalAmount + (order.discountAmount || 0);
    doc.text(`Subtotal:`, 130, finalY + 10);
    doc.text(`Rs. ${subtotal.toLocaleString()}`, 170, finalY + 10, { align: 'right' });

    // Discount
    let currentY = finalY + 10;
    if (order.discountAmount > 0) {
        currentY += 8;
        doc.setTextColor(220, 53, 69); // Red for discount
        doc.text(`Discount (${order.discountType === "FIRST_ORDER" ? "First Order" : "Promo"}):`, 130, currentY);
        doc.text(`- Rs. ${order.discountAmount.toLocaleString()}`, 170, currentY, { align: 'right' });
    }
    
    // MilletsPro summary
    if (milletsProWeightKg > 0) {
        currentY += 8;
        doc.setTextColor(50);
        doc.text(`MilletsPro Weight Ordered:`, 130, currentY);
        doc.text(`${milletsProWeightKg.toFixed(2)} kg`, 170, currentY, { align: 'right' });
    }

    // Delivery / Taxes
    if (order.shippingCost > 0) {
        currentY += 8;
        doc.setTextColor(50);
        doc.text(`Shipping:`, 130, currentY);
        doc.text(`Rs. ${order.shippingCost.toLocaleString()}`, 170, currentY, { align: 'right' });
    }

    // Final Total Line
    currentY += 12;
    doc.setDrawColor(200);
    doc.line(130, currentY - 5, 196, currentY - 5);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Final Total:`, 130, currentY);
    doc.text(`Rs. ${order.totalAmount?.toLocaleString() || 0}`, 170, currentY, { align: 'right' });

    // Save PDF
    doc.save(`ShopsMart_Invoice_${orderId}.pdf`);
};
