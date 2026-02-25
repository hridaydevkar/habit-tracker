"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

// ── Types ───────────────────────────────────────────────

type ToastVariant = "success" | "info" | "error";

interface Toast {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Hook ────────────────────────────────────────────────

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}

// ── Variant config ──────────────────────────────────────

const VARIANTS: Record<ToastVariant, { icon: typeof Info; color: string; bg: string; border: string }> = {
    success: {
        icon: CheckCircle2,
        color: "text-primary-400",
        bg: "bg-primary-500/10",
        border: "border-primary-500/30",
    },
    info: {
        icon: Info,
        color: "text-accent-400",
        bg: "bg-accent-500/10",
        border: "border-accent-500/30",
    },
    error: {
        icon: AlertTriangle,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
    },
};

// ── Provider ────────────────────────────────────────────

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, variant: ToastVariant = "success") => {
        const id = nextId++;
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}

            {/* Toast container */}
            <div 
                className="fixed bottom-20 left-4 right-4 z-[80] mx-auto flex max-w-md flex-col gap-2 sm:bottom-24 sm:left-auto sm:right-6"
                role="region"
                aria-label="Notifications"
                aria-live="polite"
                aria-atomic="true"
            >
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => {
                        const v = VARIANTS[t.variant];
                        const Icon = v.icon;
                        return (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className={`flex items-center gap-3 rounded-xl border ${v.border} ${v.bg} bg-neutral-900/95 px-4 py-3 shadow-xl backdrop-blur-xl`}
                                role="alert"
                                aria-live="assertive"
                            >
                                <Icon className={`h-5 w-5 flex-shrink-0 ${v.color}`} aria-hidden="true" />
                                <p className="flex-1 text-sm font-medium text-neutral-100">{t.message}</p>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    className="flex-shrink-0 rounded-lg p-1 text-neutral-500 transition-colors hover:text-neutral-300"
                                    aria-label="Dismiss notification"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
