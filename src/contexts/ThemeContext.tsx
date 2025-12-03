// src/contexts/ThemeContext.tsx
import { createContext, useState, useEffect, type ReactNode } from "react";

interface ThemeContextType {
    darkMode: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("arca-nostra-theme");
        return saved === "dark" || !saved; // default dark
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("arca-nostra-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("arca-nostra-theme", "light");
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};