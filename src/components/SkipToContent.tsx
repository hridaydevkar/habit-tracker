"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Skip to main content link for accessibility
 * Visible only when focused (keyboard navigation)
 */
export default function SkipToContent() {
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Tab" && !e.shiftKey) {
                setIsFocused(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const main = document.querySelector("main");
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {isFocused && (
                <motion.a
                    href="#main-content"
                    onClick={handleClick}
                    onBlur={() => setIsFocused(false)}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed left-4 top-4 z-[100] rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-400/50"
                >
                    Skip to main content
                </motion.a>
            )}
        </AnimatePresence>
    );
}
