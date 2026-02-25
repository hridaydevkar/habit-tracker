"use client";

import { motion } from "framer-motion";

// ── Spinner variants ────────────────────────────────────

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "neutral";
}

const SIZES = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
};

const COLORS = {
    primary: "border-primary-500",
    neutral: "border-neutral-400",
};

export function LoadingSpinner({ size = "md", variant = "primary" }: LoadingSpinnerProps) {
    return (
        <motion.div
            className={`${SIZES[size]} animate-spin rounded-full border-2 border-t-transparent ${COLORS[variant]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        />
    );
}

// ── Full page loader ────────────────────────────────────

export function LoadingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-neutral-400">Loading...</p>
        </div>
    );
}

// ── Skeleton loaders ────────────────────────────────────

export function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-neutral-800" />
                <div className="flex-1">
                    <div className="mb-2 h-4 w-28 rounded bg-neutral-800" />
                    <div className="h-3 w-20 rounded bg-neutral-800" />
                </div>
                <div className="h-11 w-11 rounded-full bg-neutral-800" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-2 w-2 rounded-full bg-neutral-800" />
                    ))}
                </div>
                <div className="h-4 w-12 rounded bg-neutral-800" />
            </div>
        </div>
    );
}

export function SkeletonStats() {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                    <div className="mb-2 h-3 w-16 rounded bg-neutral-800" />
                    <div className="h-6 w-12 rounded bg-neutral-800" />
                </div>
            ))}
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="mb-4 h-5 w-32 rounded bg-neutral-800" />
            <div className="h-64 rounded-xl bg-neutral-800/50" />
        </div>
    );
}
