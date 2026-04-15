import React, { createContext, useContext, useState } from "react";

export type BrandKey = "jaya" | "ssr" | "millets" | "default";

export interface BrandTheme {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    buttonClass: string;
    bgLight: string;
    name: string;
    slug: string;
    description: string;
}

export const brandThemes: Record<BrandKey, BrandTheme> = {
    default: {
        primary: "#1B5E20",
        secondary: "#C8E6C9",
        accent: "#2E7D32",
        gradient: "linear-gradient(135deg, #1B5E20, #2E7D32)",
        buttonClass: "bg-green-800 hover:bg-green-700 text-white",
        bgLight: "#f0fdf4",
        name: "ShopSmart",
        slug: "",
        description: "",
    },
    jaya: {
        primary: "#C79A3B",
        secondary: "#F5E6C8",
        accent: "#7A4E1D",
        gradient: "linear-gradient(135deg, #C79A3B, #7A4E1D)",
        buttonClass: "bg-amber-600 hover:bg-amber-500 text-white",
        bgLight: "#fdf8ee",
        name: "Jaya Janardhana",
        slug: "jaya-janardhana",
        description: "Authentic Pooja Essentials & Sacred Items",
    },
    ssr: {
        primary: "#1B5E20",
        secondary: "#C8E6C9",
        accent: "#2E7D32",
        gradient: "linear-gradient(135deg, #1B5E20, #2E7D32)",
        buttonClass: "bg-green-800 hover:bg-green-700 text-white",
        bgLight: "#f0fdf4",
        name: "SSR",
        slug: "ssr",
        description: "Authentic Pooja Essentials & Sacred Items",
    },
    millets: {
        primary: "#424242",
        secondary: "#EEEEEE",
        accent: "#212121",
        gradient: "linear-gradient(135deg, #424242, #212121)",
        buttonClass: "bg-gray-700 hover:bg-gray-600 text-white",
        bgLight: "#f9f9f9",
        name: "Millets Pro",
        slug: "millets-pro",
        description: "Organic millets and superfood grains for health-conscious stores",
    },
};

interface BrandThemeContextType {
    activeBrand: BrandKey;
    theme: BrandTheme;
    setActiveBrand: (brand: BrandKey) => void;
}

const BrandThemeContext = createContext<BrandThemeContextType>({
    activeBrand: "default",
    theme: brandThemes.default,
    setActiveBrand: () => { },
});

export const BrandThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeBrand, setActiveBrand] = useState<BrandKey>("default");
    const theme = brandThemes[activeBrand];

    return (
        <BrandThemeContext.Provider value={{ activeBrand, theme, setActiveBrand }}>
            <div
                style={{
                    "--brand-primary": theme.primary,
                    "--brand-secondary": theme.secondary,
                    "--brand-accent": theme.accent,
                    "--brand-gradient": theme.gradient,
                    "--brand-bg-light": theme.bgLight,
                } as React.CSSProperties}
            >
                {children}
            </div>
        </BrandThemeContext.Provider>
    );
};

export const useBrandTheme = () => useContext(BrandThemeContext);
