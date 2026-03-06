import React from "react";
import { Link } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";

const Register = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 py-12"
            style={{
                background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[720px] bg-white rounded-[20px] p-8 md:p-10 shadow-xl border border-white/50 relative overflow-hidden"
            >
                <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 left-0" />

                <RegisterForm />

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-500 font-medium">
                        Already have an account?{" "}
                        <Link to="/login" className="text-green-600 font-semibold hover:underline transition-colors hover:text-green-700">
                            Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
