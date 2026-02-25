"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

// ── SVG Illustrations ───────────────────────────────────

function SproutIllustration() {
    return (
        <svg viewBox="0 0 200 200" className="h-40 w-40" fill="none">
            {/* Pot */}
            <path d="M60 150 L80 180 L120 180 L140 150 Z" fill="var(--n-700)" opacity="0.5" />
            <path d="M55 140 H145 V155 H55Z" rx="4" fill="var(--n-700)" opacity="0.7" />
            {/* Soil */}
            <ellipse cx="100" cy="142" rx="42" ry="6" fill="var(--n-600)" opacity="0.5" />
            {/* Stem */}
            <motion.path
                d="M100 140 Q100 110 100 80"
                stroke="var(--p-400)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {/* Left leaf */}
            <motion.path
                d="M100 105 Q80 90 70 65 Q90 75 100 105"
                fill="var(--p-400)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                style={{ transformOrigin: "100px 105px" }}
            />
            {/* Right leaf */}
            <motion.path
                d="M100 90 Q120 75 135 55 Q115 70 100 90"
                fill="var(--p-500)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
                style={{ transformOrigin: "100px 90px" }}
            />
            {/* Sparkle dots */}
            <motion.circle cx="65" cy="50" r="2" fill="var(--s-400)"
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 1.4, duration: 2, repeat: Infinity }} />
            <motion.circle cx="140" cy="40" r="1.5" fill="var(--a-400)"
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 1.8, duration: 2, repeat: Infinity }} />
            <motion.circle cx="85" cy="35" r="1.5" fill="var(--p-400)"
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 2.2, duration: 2, repeat: Infinity }} />
        </svg>
    );
}

function ChartIllustration() {
    return (
        <svg viewBox="0 0 200 160" className="h-32 w-32" fill="none">
            {/* Bars */}
            {[
                { x: 30, h: 40 }, { x: 60, h: 70 }, { x: 90, h: 55 },
                { x: 120, h: 90 }, { x: 150, h: 75 },
            ].map((bar, i) => (
                <motion.rect
                    key={i} x={bar.x} y={140 - bar.h} width="20" height={bar.h}
                    rx="4" fill="var(--p-400)" opacity={0.3 + i * 0.15}
                    initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
                    style={{ transformOrigin: `${bar.x + 10}px 140px` }}
                />
            ))}
            {/* Base line */}
            <line x1="20" y1="140" x2="180" y2="140" stroke="var(--n-600)" strokeWidth="1" opacity="0.5" />
        </svg>
    );
}

// ── Props ───────────────────────────────────────────────

interface EmptyStateProps {
    variant: "habits" | "stats" | "achievements";
    onAction?: () => void;
}

const CONFIG = {
    habits: {
        illustration: SproutIllustration,
        title: "Plant your first seed",
        description: "Start small — even 2 minutes counts. Add your first habit and watch it grow!",
        cta: "Add Your First Habit",
        tips: [
            "🌱 Start with 1-2 habits",
            "⏰ Pick specific times",
            "🎯 Make it ridiculously easy",
        ],
    },
    stats: {
        illustration: ChartIllustration,
        title: "Your stats will appear here",
        description: "Complete some habits and check back to see your streaks, completion rates, and trends.",
        cta: null,
        tips: [
            "📊 Track your progress daily",
            "🔥 Build your streak",
            "📈 Watch your growth over time",
        ],
    },
    achievements: {
        illustration: ChartIllustration,
        title: "Achievements await you",
        description: "Keep building your habits. Badges and milestones unlock as you stay consistent!",
        cta: null,
        tips: [
            "🏆 Complete streaks to unlock badges",
            "⭐ Earn rewards for consistency",
            "🎯 Challenge yourself daily",
        ],
    },
};

// ── Component ───────────────────────────────────────────

function EmptyState({ variant, onAction }: EmptyStateProps) {
    const { illustration: Illustration, title, description, cta, tips } = CONFIG[variant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
        >
            <Illustration />
            <h3 className="mt-6 text-xl font-bold text-neutral-100">{title}</h3>
            <p className="mt-2 max-w-xs text-sm text-neutral-400">{description}</p>

            {/* Tips */}
            {tips && tips.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 space-y-2"
                >
                    {tips.map((tip, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="text-xs text-neutral-500"
                        >
                            {tip}
                        </motion.p>
                    ))}
                </motion.div>
            )}

            {cta && onAction && (
                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onAction}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-colors hover:bg-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
                    aria-label={cta}
                >
                    <Plus className="h-4 w-4" aria-hidden="true" /> {cta}
                </motion.button>
            )}
        </motion.div>
    );
}

// Memoize to prevent unnecessary re-renders
export default memo(EmptyState);
