import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/shop/Header";
import ShopFooter from "@/components/shop/ShopFooter";
import api from "@/lib/api";

const BulkOrder = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || "";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        productName: category ? `Interest in ${category?.toUpperCase()}` : "",
        quantity: "",
        requirements: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await api.post("/bulk-order", formData);
            setIsSuccess(true);
            toast.success("Bulk order request submitted successfully!");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h2>
                        <p className="text-gray-500 mb-8">
                            Thank you for your bulk order request. Our team will review your requirements and get back to you within 24 hours to discuss pricing and fulfillment.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-[#1B5E20] text-white py-3 rounded-xl font-medium hover:bg-[#2E7D32] transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
                <ShopFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk / Custom Order</h1>
                        <p className="text-gray-500">
                            Looking to order in large quantities? Fill out the form below and we'll provide you with our best B2B rates and custom packaging options.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] outline-none transition-all"
                                    placeholder="+91"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] outline-none transition-all"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name(s) *</label>
                                <input
                                    required
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] outline-none transition-all"
                                    placeholder="Which products do you need?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Quantity *</label>
                                <input
                                    required
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] outline-none transition-all"
                                    placeholder="e.g. 100 kg, 50 cartons"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Requirements</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows={4}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] outline-none transition-all resize-none"
                                placeholder="Any specific packaging sizes, delivery schedules, or other instructions?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-[#1B5E20] text-white py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                                </>
                            ) : (
                                "Submit Bulk Order Request"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            <ShopFooter />
        </div>
    );
};

export default BulkOrder;
