"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextValue {
    theme: ThemeMode;
    resolved: "light" | "dark";
    setTheme: (t: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    resolved: "dark",
    setTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getStoredTheme(): ThemeMode {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("habitflow_theme") as ThemeMode) || "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>("dark");
    const [resolved, setResolved] = useState<"light" | "dark">("dark");

    // Hydrate from localStorage
    useEffect(() => {
        const stored = getStoredTheme();
        setThemeState(stored);
    }, []);

    // Resolve theme and apply to DOM
    useEffect(() => {
        const r = theme === "auto" ? getSystemTheme() : theme;
        setResolved(r);

        // Apply to <html>
        document.documentElement.setAttribute("data-theme", r);
        // Update color-scheme for native controls
        document.documentElement.style.colorScheme = r;
        // Update theme-color meta
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", r === "light" ? "#fdf2f4" : "#0f172a");
        }
    }, [theme]);

    // Listen for system theme changes when in auto mode
    useEffect(() => {
        if (theme !== "auto") return;
        const mq = window.matchMedia("(prefers-color-scheme: light)");
        const handler = () => setResolved(mq.matches ? "light" : "dark");
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [theme]);

    const setTheme = useCallback((t: ThemeMode) => {
        setThemeState(t);
        localStorage.setItem("habitflow_theme", t);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
