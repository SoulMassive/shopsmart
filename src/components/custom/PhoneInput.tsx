import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    onPhoneChange?: (value: string) => void;
}

export function PhoneInput({ label, error, id, onChange, onPhoneChange, ...props }: PhoneInputProps) {
    const [countryCode, setCountryCode] = useState("+91");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e);
        if (onPhoneChange) onPhoneChange(e.target.value);
    };

    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-gray-700 font-medium text-sm">
                {label}
            </Label>
            <div className="flex gap-2 relative">
                <div className="relative isolate group">
                    <select
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                    >
                        <option value="+91">IN (+91)</option>
                        <option value="+1">US (+1)</option>
                        <option value="+44">UK (+44)</option>
                    </select>
                    <div className="flex items-center justify-center bg-gray-50 border border-gray-300 rounded-xl h-full px-3 text-sm font-medium text-gray-700 shadow-sm group-hover:border-gray-400 transition-colors pointer-events-none">
                        🇮🇳 {countryCode}
                    </div>
                </div>
                <Input
                    id={id}
                    className={`flex-1 rounded-xl border border-gray-300 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 px-4 py-3 shadow-sm transition-all duration-200 bg-white hover:border-gray-400 ${error ? "border-red-500" : ""
                        } ${props.className || ""}`}
                    onChange={handleInputChange}
                    {...props}
                />
            </div>
            {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
        </div>
    );
}
