"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useHabits } from "@/lib/HabitContext";
import { playCompletionChime } from "@/lib/sounds";
import type { HabitWithStats } from "@/types";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Icon resolver ───────────────────────────────────────

function getIcon(name: string): LucideIcon {
    const icon = (Icons as Record<string, unknown>)[name];
    if (typeof icon === "object" && icon !== null) return icon as LucideIcon;
    return Icons.Circle;
}

// ── Color mappings ──────────────────────────────────────

const COLOR = {
    primary: {
        ring: "ring-primary-500/40",
        bg: "bg-primary-500/10",
        bgHover: "hover:bg-primary-500/20",
        text: "text-primary-400",
        check: "bg-primary-500",
        dot: "bg-primary-400",
        dotMuted: "bg-primary-900",
        glow: "shadow-primary-500/20",
        border: "border-primary-500/20",
        borderHover: "hover:border-primary-500/40",
    },
    secondary: {
        ring: "ring-secondary-500/40",
        bg: "bg-secondary-500/10",
        bgHover: "hover:bg-secondary-500/20",
        text: "text-secondary-400",
        check: "bg-secondary-500",
        dot: "bg-secondary-400",
        dotMuted: "bg-secondary-900",
        glow: "shadow-secondary-500/20",
        border: "border-secondary-500/20",
        borderHover: "hover:border-secondary-500/40",
    },
    accent: {
        ring: "ring-accent-500/40",
        bg: "bg-accent-500/10",
        bgHover: "hover:bg-accent-500/20",
        text: "text-accent-400",
        check: "bg-accent-500",
        dot: "bg-accent-400",
        dotMuted: "bg-accent-900",
        glow: "shadow-accent-500/20",
        border: "border-accent-500/20",
        borderHover: "hover:border-accent-500/40",
    },
} as const;

// ── Confetti particle ───────────────────────────────────

interface Particle {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    delay: number;
}

function Confetti({ active }: { active: boolean }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!active) {
            setParticles([]);
            return;
        }
        const colors = ["#10b981", "#f59e0b", "#a855f7", "#3b82f6", "#ef4444", "#ec4899"];
        const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
            id: i,
            x: Math.random() * 100 - 50,
            y: -(Math.random() * 80 + 40),
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 6 + 3,
            delay: Math.random() * 0.3,
        }));
        setParticles(newParticles);
        const timer = setTimeout(() => setParticles([]), 900);
        return () => clearTimeout(timer);
    }, [active]);

    if (particles.length === 0) return null;

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
                <span
                    key={p.id}
                    className="absolute left-1/2 top-1/2 rounded-sm"
                    style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
                        animation: `confetti-burst 0.7s ease-out ${p.delay}s forwards`,
                        opacity: 0,
                    }}
                />
            ))}
        </div>
    );
}

// ── SVG Checkmark ───────────────────────────────────────

function AnimatedCheck({ visible }: { visible: boolean }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                    <motion.path
                        d="M5 12l5 5L19 7"
                        fill="none"
                        stroke="white"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                    />
                </motion.svg>
            )}
        </AnimatePresence>
    );
}

// ── Delete confirmation ─────────────────────────────────

function DeleteConfirm({
    habitName,
    onConfirm,
    onCancel,
}: {
    habitName: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl"
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <Icons.AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-neutral-100">Delete &quot;{habitName}&quot;?</h3>
                <p className="mt-1 text-sm text-neutral-400">
                    This will permanently remove this habit and all its history. This action cannot be undone.
                </p>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </>
    );
}

// ── HabitCard ───────────────────────────────────────────

interface HabitCardProps {
    habit: HabitWithStats;
    onDeleted?: () => void;
}

export default function HabitCard({ habit, onDeleted }: HabitCardProps) {
    const { toggleHabitCompletion, deleteHabit, settings } = useHabits();
    const [showConfetti, setShowConfetti] = useState(false);
    const [justCompleted, setJustCompleted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [swipeHint, setSwipeHint] = useState(false);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const c = COLOR[habit.color];
    const Icon = getIcon(habit.icon);

    const handleToggle = useCallback(() => {
        if (!habit.todayCompleted) {
            setShowConfetti(true);
            setJustCompleted(true);
            setTimeout(() => setJustCompleted(false), 600);
            if (settings.soundEnabled) playCompletionChime();
        }
        toggleHabitCompletion(habit.id);
    }, [habit.todayCompleted, habit.id, toggleHabitCompletion, settings.soundEnabled]);

    const handleDelete = useCallback(() => {
        deleteHabit(habit.id);
        setShowDeleteConfirm(false);
        setShowMenu(false);
        onDeleted?.();
    }, [habit.id, deleteHabit, onDeleted]);

    // Swipe to complete
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
        if (dx >= 80 && dy < 60 && !habit.todayCompleted) {
            setSwipeHint(true);
            setTimeout(() => setSwipeHint(false), 400);
            handleToggle();
        }
    }, [habit.todayCompleted, handleToggle]);

    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

    const cardClass = [
        "group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm transition-all duration-200",
        c.borderHover,
        "hover:shadow-lg",
        c.glow,
        "focus-within:ring-2",
        c.ring,
    ].join(" ");

    const iconBoxClass = ["flex h-10 w-10 items-center justify-center rounded-xl", c.bg, "transition-colors", c.bgHover].join(" ");

    const toggleClass = [
        "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-200",
        habit.todayCompleted
            ? `${c.check} border-transparent scale-110 ${justCompleted ? "animate-bounce-once" : ""}`
            : "border-neutral-600 hover:border-neutral-400 hover:scale-105",
    ].join(" ");

    return (
        <>
            <motion.div
                layout
                whileTap={{ scale: 0.97 }}
                className={cardClass}
                role="article"
                aria-label={`${habit.name} habit card`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Swipe hint overlay */}
                {swipeHint && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-primary-500/10 animate-swipe-hint">
                        <Icons.ChevronRight className="h-8 w-8 text-primary-400" />
                    </div>
                )}
                <Confetti active={showConfetti} />

                {/* ── Header row ─────────────────────────────────── */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className={iconBoxClass}>
                            <Icon className={`h-5 w-5 ${c.text}`} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate font-semibold text-neutral-100">{habit.name}</h3>
                            {habit.currentStreak > 0 && (
                                <p className={`flex items-center gap-1 text-xs text-neutral-500 ${habit.currentStreak >= 14 ? "animate-pulse-flame" : ""}`}>
                                    <span className={habit.currentStreak >= 30 ? "text-base" : habit.currentStreak >= 14 ? "text-sm" : ""}>
                                        {habit.currentStreak >= 30 ? "🔥🔥🔥" : habit.currentStreak >= 14 ? "🔥🔥" : "🔥"}
                                    </span>
                                    <span className={`font-medium ${habit.currentStreak >= 14 ? "text-secondary-300" : "text-secondary-400"}`}>
                                        {habit.currentStreak} day{habit.currentStreak !== 1 ? "s" : ""}
                                    </span>
                                    {habit.currentStreak >= 7 && (
                                        <span className="ml-1 rounded-full bg-secondary-500/20 px-1.5 py-0.5 text-[9px] font-bold text-secondary-400">
                                            +BONUS
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Right actions: toggle + menu ─────────────────── */}
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                            onClick={handleToggle}
                            onKeyDown={(e) => e.key === "Enter" && handleToggle()}
                            aria-label={habit.todayCompleted ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
                            className={toggleClass}
                        >
                            <AnimatedCheck visible={habit.todayCompleted} />
                        </button>

                        {/* ── Three-dot menu ────────────────────────────── */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="rounded-lg p-1.5 text-neutral-600 transition-all hover:bg-neutral-800 hover:text-neutral-400"
                                aria-label="Habit options"
                            >
                                <Icons.MoreVertical className="h-4 w-4" />
                            </button>
                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-8 z-20 w-36 rounded-xl border border-neutral-700 bg-neutral-800 py-1 shadow-xl"
                                        >
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowDeleteConfirm(true);
                                                }}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-neutral-700"
                                            >
                                                <Icons.Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ── Weekly dots ────────────────────────────────── */}
                <div className="flex items-center gap-1.5" aria-label="Last 7 days">
                    {habit.weeklyData.map((d, i) => {
                        const dotClass = `h-2.5 w-2.5 rounded-full transition-all duration-300 ${d.completed >= d.target ? c.dot : c.dotMuted}`;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-neutral-600">
                                    {dayLabels[(new Date().getDay() - (6 - i) + 7) % 7]}
                                </span>
                                <div
                                    className={dotClass}
                                    aria-label={`${d.day}: ${d.completed >= d.target ? "completed" : "not completed"}`}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* ── Subtle progress bar ────────────────────────── */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                    <motion.div
                        className={`h-full rounded-full ${c.check}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(habit.completionRate * 100)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                </div>


            </motion.div>

            {/* Delete confirmation modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <DeleteConfirm
                        habitName={habit.name}
                        onConfirm={handleDelete}
                        onCancel={() => setShowDeleteConfirm(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
