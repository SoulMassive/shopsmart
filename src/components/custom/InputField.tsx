import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function InputField({ label, error, id, ...props }: InputFieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-gray-700 font-medium text-sm">
                {label}
            </Label>
            <Input
                id={id}
                className={`rounded-xl border border-gray-300 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 px-4 py-2 shadow-sm transition-all duration-200 bg-white hover:border-gray-400 ${error ? "border-red-500 py-3" : "py-3"
                    } ${props.className || ""}`}
                {...props}
            />
            {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
        </div>
    );
}
