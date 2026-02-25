"use client";

import { useState, useMemo, useCallback } from "react";
import { useHabits } from "@/lib/HabitContext";
import { useToast } from "@/components/Toast";
import { formatDate } from "@/lib/storage";
import { CATEGORY_META } from "@/lib/habitTemplates";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Check,
    AlertTriangle,
} from "lucide-react";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isAfter,
    isToday,
} from "date-fns";

// ── Color for completion dots ───────────────────────────

const DOT_COLORS: Record<string, string> = {
    primary: "bg-primary-400",
    secondary: "bg-secondary-400",
    accent: "bg-accent-400",
};

// ── CalendarView ────────────────────────────────────────

export default function CalendarView() {
    const { habits, logs, habitsWithStats, toggleHabitCompletion } = useHabits();
    const { toast } = useToast();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showBackdateWarning, setShowBackdateWarning] = useState<string | null>(null);

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
        const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
        return eachDayOfInterval({ start: calStart, end: calEnd });
    }, [currentMonth]);

    // Build a map: dateStr → list of completed habit colors
    const completionMap = useMemo(() => {
        const map: Record<string, { habitId: string; color: string; name: string }[]> = {};
        for (const log of logs) {
            if (!log.completed) continue;
            const dateStr = formatDate(new Date(log.date));
            const habit = habits.find((h) => h.id === log.habitId);
            if (!habit) continue;
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push({ habitId: habit.id, color: habit.color, name: habit.name });
        }
        return map;
    }, [logs, habits]);

    // Habits for selected date
    const selectedDateHabits = useMemo(() => {
        if (!selectedDate) return [];
        const dateStr = formatDate(selectedDate);
        const completedIds = new Set(
            logs
                .filter((l) => formatDate(new Date(l.date)) === dateStr && l.completed)
                .map((l) => l.habitId),
        );
        return habits
            .filter((h) => !h.archived)
            .map((h) => ({
                ...h,
                completed: completedIds.has(h.id),
            }));
    }, [selectedDate, habits, logs]);

    const handleBackdate = useCallback(
        (habitId: string, date: Date) => {
            if (isAfter(date, new Date())) {
                toast("Can't log future dates", "error");
                return;
            }
            if (!isToday(date)) {
                setShowBackdateWarning(habitId);
                return;
            }
            toggleHabitCompletion(habitId, date);
            toast("Habit toggled", "success");
        },
        [toggleHabitCompletion, toast],
    );

    const confirmBackdate = useCallback(
        (habitId: string) => {
            if (selectedDate) {
                toggleHabitCompletion(habitId, selectedDate);
                toast("Past date logged", "info");
            }
            setShowBackdateWarning(null);
        },
        [selectedDate, toggleHabitCompletion, toast],
    );

    const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Month stats
    const monthStats = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        let totalDays = 0;
        let completedDays = 0;
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        for (const day of days) {
            if (isAfter(day, new Date())) continue;
            totalDays++;
            const dateStr = formatDate(day);
            if (completionMap[dateStr]?.length) completedDays++;
        }
        return { totalDays, completedDays, rate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0 };
    }, [currentMonth, completionMap]);

    return (
        <div className="mx-auto min-h-screen max-w-2xl px-5 pb-28 pt-10">
            {/* ── Header ─────────────────────────────────────── */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-extrabold text-neutral-50">Calendar</h1>
                <p className="text-sm text-neutral-500">Track your completion history</p>
            </motion.header>

            {/* ── Month navigation ─────────────────────────────── */}
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                    className="rounded-xl bg-neutral-800/60 p-2.5 text-neutral-400 transition-colors hover:bg-neutral-700/60 hover:text-neutral-200"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <motion.h2
                    key={format(currentMonth, "yyyy-MM")}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-bold text-neutral-100"
                >
                    {format(currentMonth, "MMMM yyyy")}
                </motion.h2>

                <button
                    onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                    className="rounded-xl bg-neutral-800/60 p-2.5 text-neutral-400 transition-colors hover:bg-neutral-700/60 hover:text-neutral-200"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* ── Month stats bar ──────────────────────────────── */}
            <div className="mb-4 flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 px-4 py-3">
                <div className="flex-1">
                    <p className="text-xs text-neutral-500">Active Days</p>
                    <p className="text-lg font-bold text-neutral-100">{monthStats.completedDays}/{monthStats.totalDays}</p>
                </div>
                <div className="h-10 w-px bg-neutral-700" />
                <div className="flex-1">
                    <p className="text-xs text-neutral-500">Completion</p>
                    <p className="text-lg font-bold text-primary-400">{monthStats.rate}%</p>
                </div>
            </div>

            {/* ── Calendar grid ────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm"
            >
                {/* Day headers */}
                <div className="mb-2 grid grid-cols-7 text-center">
                    {weekDayNames.map((d) => (
                        <span key={d} className="p-1 text-[11px] font-medium text-neutral-500">{d}</span>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, i) => {
                        const dateStr = formatDate(day);
                        const dots = completionMap[dateStr] || [];
                        const inMonth = isSameMonth(day, currentMonth);
                        const today = isToday(day);
                        const selected = selectedDate && isSameDay(day, selectedDate);
                        const future = isAfter(day, new Date());

                        return (
                            <button
                                key={i}
                                onClick={() => !future && setSelectedDate(day)}
                                disabled={future}
                                className={[
                                    "relative flex flex-col items-center gap-0.5 rounded-xl py-2 transition-all",
                                    !inMonth ? "opacity-30" : "",
                                    future ? "opacity-20 cursor-not-allowed" : "cursor-pointer hover:bg-neutral-800/60",
                                    today ? "ring-1 ring-primary-500/40" : "",
                                    selected ? "bg-primary-500/15" : "",
                                ].join(" ")}
                            >
                                <span className={[
                                    "text-sm font-medium",
                                    today ? "text-primary-400 font-bold" : "text-neutral-300",
                                    selected ? "text-primary-300" : "",
                                ].join(" ")}>
                                    {format(day, "d")}
                                </span>
                                {/* Completion dots */}
                                <div className="flex gap-0.5">
                                    {dots.slice(0, 3).map((d, di) => (
                                        <div key={di} className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[d.color] || "bg-neutral-500"}`} />
                                    ))}
                                    {dots.length > 3 && (
                                        <span className="text-[7px] text-neutral-500">+{dots.length - 3}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── Legend ────────────────────────────────────────── */}
            {habits.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-3">
                    {habits.filter((h) => !h.archived).map((h) => (
                        <div key={h.id} className="flex items-center gap-1.5">
                            <div className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[h.color] || "bg-neutral-500"}`} />
                            <span className="text-xs text-neutral-400">{h.name}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Selected date detail panel ────────────────────── */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm"
                    >
                        <h3 className="mb-3 text-sm font-bold text-neutral-100">
                            {format(selectedDate, "EEEE, MMMM d")}
                            {isToday(selectedDate) && (
                                <span className="ml-2 rounded-full bg-primary-500/20 px-2 py-0.5 text-[10px] text-primary-400">Today</span>
                            )}
                        </h3>

                        {selectedDateHabits.length === 0 ? (
                            <p className="py-4 text-center text-sm text-neutral-500">No habits tracked yet</p>
                        ) : (
                            <div className="space-y-2">
                                {selectedDateHabits.map((h) => (
                                    <div
                                        key={h.id}
                                        className="flex items-center justify-between rounded-xl bg-neutral-800/40 px-3 py-2.5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2.5 w-2.5 rounded-full ${DOT_COLORS[h.color] || "bg-neutral-500"}`} />
                                            <span className={`text-sm ${h.completed ? "text-neutral-200" : "text-neutral-500"}`}>
                                                {h.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleBackdate(h.id, selectedDate)}
                                            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${h.completed
                                                    ? "bg-primary-500 text-white"
                                                    : "border border-neutral-600 text-neutral-600 hover:border-neutral-400"
                                                }`}
                                        >
                                            {h.completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Backdate warning dialog ────────────────────────── */}
            <AnimatePresence>
                {showBackdateWarning && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowBackdateWarning(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-500/10">
                                <AlertTriangle className="h-6 w-6 text-secondary-400" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-100">Log past date?</h3>
                            <p className="mt-1 text-sm text-neutral-400">
                                You&apos;re about to log a habit for{" "}
                                <strong>{selectedDate && format(selectedDate, "MMM d")}</strong>.
                                Backdating affects your streak calculations.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setShowBackdateWarning(null)}
                                    className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => confirmBackdate(showBackdateWarning)}
                                    className="flex-1 rounded-xl bg-secondary-500 py-2.5 text-sm font-semibold text-white hover:bg-secondary-400"
                                >
                                    Log It
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
