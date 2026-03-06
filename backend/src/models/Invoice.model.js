const mongoose = require('mongoose');

// Line item embedded in invoice — snapshot for legal records
const invoiceLineItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    sku: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        outletId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outlet',
            required: true,
        },
        // Snapshot — must not reference live outlet since address can change
        billingAddress: {
            outletName: { type: String, required: true },
            gstNumber: { type: String },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, default: 'India' },
        },

        // Embedded line items — legal document, must never change
        lineItems: [invoiceLineItemSchema],

        subtotal: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },

        // GST breakdown
        gstDetails: {
            cgst: { type: Number, default: 0 },
            sgst: { type: Number, default: 0 },
            igst: { type: Number, default: 0 },
            totalGst: { type: Number, default: 0 },
        },

        status: {
            type: String,
            enum: ['Draft', 'Issued', 'Paid', 'Cancelled'],
            default: 'Issued',
        },
        dueDate: { type: Date },
        paidAt: { type: Date },
        pdfUrl: { type: String }, // CDN URL to generated PDF

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ orderId: 1 });
invoiceSchema.index({ outletId: 1, createdAt: -1 });
invoiceSchema.index({ status: 1 });

invoiceSchema.statics.generateInvoiceNumber = async function () {
    const year = new Date().getFullYear();
    const count = await this.countDocuments();
    return `INV-${year}-${String(count + 1).padStart(6, '0')}`;
};

module.exports = mongoose.model('Invoice', invoiceSchema);
