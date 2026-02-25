"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

// ── Types ───────────────────────────────────────────────

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

// ── Variant config ──────────────────────────────────────

const VARIANTS = {
    danger: {
        icon: Trash2,
        iconBg: "bg-red-500/10",
        iconColor: "text-red-400",
        confirmBg: "bg-red-500 hover:bg-red-400",
    },
    warning: {
        icon: AlertTriangle,
        iconBg: "bg-secondary-500/10",
        iconColor: "text-secondary-400",
        confirmBg: "bg-secondary-500 hover:bg-secondary-400",
    },
    info: {
        icon: AlertTriangle,
        iconBg: "bg-accent-500/10",
        iconColor: "text-accent-400",
        confirmBg: "bg-accent-500 hover:bg-accent-400",
    },
};

// ── Component ───────────────────────────────────────────

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
}: ConfirmDialogProps) {
    const v = VARIANTS[variant];
    const Icon = v.icon;

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Lock body scroll
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed left-1/2 top-1/2 z-[70] w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl"
                        role="alertdialog"
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-lg p-1 text-neutral-500 transition-colors hover:text-neutral-300"
                            aria-label="Close dialog"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 25 }}
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${v.iconBg}`}
                        >
                            <Icon className={`h-6 w-6 ${v.iconColor}`} />
                        </motion.div>

                        {/* Content */}
                        <h3 id="dialog-title" className="text-lg font-bold text-neutral-100">
                            {title}
                        </h3>
                        <p id="dialog-description" className="mt-2 text-sm leading-relaxed text-neutral-400">
                            {message}
                        </p>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-sm font-medium text-neutral-300 transition-all hover:bg-neutral-700 active:scale-95"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all active:scale-95 ${v.confirmBg}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
