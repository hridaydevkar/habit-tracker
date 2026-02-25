"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { useState } from "react";

// ── Network Error Component ─────────────────────────────

interface NetworkErrorProps {
    onRetry: () => void;
    message?: string;
}

export default function NetworkError({
    onRetry,
    message = "Unable to connect. Check your internet connection and try again.",
}: NetworkErrorProps) {
    const [retrying, setRetrying] = useState(false);

    const handleRetry = async () => {
        setRetrying(true);
        await onRetry();
        setTimeout(() => setRetrying(false), 500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
        >
            {/* Illustration */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10"
            >
                <WifiOff className="h-10 w-10 text-red-400" />
            </motion.div>

            <h2 className="text-xl font-bold text-neutral-100">Connection Lost</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-400">{message}</p>

            {/* Retry button */}
            <motion.button
                onClick={handleRetry}
                disabled={retrying}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
                {retrying ? "Retrying..." : "Try Again"}
            </motion.button>
        </motion.div>
    );
}

// ── Inline Network Error ────────────────────────────────

export function InlineNetworkError({ onRetry, small }: { onRetry: () => void; small?: boolean }) {
    return (
        <div
            className={`flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 ${
                small ? "p-3" : "p-4"
            }`}
        >
            <div className="flex items-center gap-3">
                <WifiOff className={`${small ? "h-4 w-4" : "h-5 w-5"} text-red-400`} />
                <p className={`${small ? "text-xs" : "text-sm"} text-neutral-300`}>
                    Connection error
                </p>
            </div>
            <button
                onClick={onRetry}
                className={`rounded-lg bg-red-500/20 ${
                    small ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
                } font-medium text-red-300 transition-colors hover:bg-red-500/30`}
            >
                Retry
            </button>
        </div>
    );
}
