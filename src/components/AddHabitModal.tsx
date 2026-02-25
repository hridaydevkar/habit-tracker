"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useHabits } from "@/lib/HabitContext";
import { useToast } from "@/components/Toast";
import type { HabitColor, HabitCategory } from "@/types/habit";
import * as Icons from "lucide-react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HABIT_TEMPLATES, CATEGORY_META, type HabitTemplate } from "@/lib/habitTemplates";
import { motion, AnimatePresence } from "framer-motion";

// ── Icon helpers ────────────────────────────────────────

function getIcon(name: string): LucideIcon {
    const icon = (Icons as Record<string, unknown>)[name];
    if (typeof icon === "object" && icon !== null) return icon as LucideIcon;
    return Icons.Circle;
}

const ICON_OPTIONS = [
    "Brain", "Heart", "Dumbbell", "BookOpen", "Pencil", "Moon",
    "Sun", "GlassWater", "Apple", "Music", "Code", "Palette",
    "Zap", "Footprints", "Smartphone", "Languages",
];

// ── Color options ───────────────────────────────────────

const COLOR_OPTIONS: { value: HabitColor; label: string; classes: string }[] = [
    { value: "primary", label: "Emerald", classes: "bg-primary-500" },
    { value: "secondary", label: "Amber", classes: "bg-secondary-500" },
    { value: "accent", label: "Purple", classes: "bg-accent-500" },
];

// ── Category options ────────────────────────────────────

const CATEGORY_OPTIONS: { value: HabitCategory; label: string }[] = [
    { value: "health", label: "🩺 Health" },
    { value: "fitness", label: "💪 Fitness" },
    { value: "mindfulness", label: "🧘 Mindfulness" },
    { value: "productivity", label: "⚡ Productivity" },
    { value: "learning", label: "📚 Learning" },
    { value: "social", label: "👥 Social" },
    { value: "creative", label: "🎨 Creative" },
    { value: "other", label: "📌 Other" },
];

// ── Component ───────────────────────────────────────────

interface AddHabitModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AddHabitModal({ open, onClose }: AddHabitModalProps) {
    const { addHabit } = useHabits();
    const { toast } = useToast();
    const dialogRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    // Tab state
    const [tab, setTab] = useState<"templates" | "custom">("templates");
    const [templateFilter, setTemplateFilter] = useState<HabitCategory | "all">("all");

    // Form state
    const [name, setName] = useState("");
    const [icon, setIcon] = useState<string>("Brain");
    const [color, setColor] = useState<HabitColor>("primary");
    const [category, setCategory] = useState<HabitCategory>("health");
    const [goalDays, setGoalDays] = useState(21);
    const [reminderTime, setReminderTime] = useState("");
    const [description, setDescription] = useState("");

    // Validation
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Focus the name input when custom tab opens
    useEffect(() => {
        if (open && tab === "custom") {
            setTimeout(() => nameRef.current?.focus(), 100);
        }
    }, [open, tab]);

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

    // Reset on close
    useEffect(() => {
        if (!open) {
            setTab("templates");
            setTemplateFilter("all");
        }
    }, [open]);

    const filteredTemplates = useMemo(() => {
        if (templateFilter === "all") return HABIT_TEMPLATES;
        return HABIT_TEMPLATES.filter((t) => t.category === templateFilter);
    }, [templateFilter]);

    const resetForm = useCallback(() => {
        setName("");
        setIcon("Brain");
        setColor("primary");
        setCategory("health");
        setGoalDays(21);
        setReminderTime("");
        setDescription("");
        setError("");
        setSubmitted(false);
    }, []);

    const handleTemplateAdd = useCallback(
        (template: HabitTemplate) => {
            addHabit({
                name: template.name,
                icon: template.icon,
                color: template.color,
                category: template.category,
                goalDays: template.goalDays,
                description: template.description,
            });
            toast(`"${template.name}" added!`, "success");
            onClose();
        },
        [addHabit, toast, onClose],
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitted(true);

            const trimmed = name.trim();
            if (!trimmed) {
                setError("Habit name is required.");
                return;
            }
            if (trimmed.length > 40) {
                setError("Name must be 40 characters or fewer.");
                return;
            }

            addHabit({
                name: trimmed,
                icon,
                color,
                category,
                goalDays,
                reminderTime: reminderTime || undefined,
                description: description.trim() || undefined,
            });

            toast(`"${trimmed}" created!`, "success");
            resetForm();
            onClose();
        },
        [name, icon, color, category, goalDays, reminderTime, description, addHabit, onClose, resetForm, toast],
    );

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <motion.div
                ref={dialogRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-neutral-700/60 bg-neutral-900/95 p-6 shadow-2xl backdrop-blur-md"
            >
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="modal-title" className="text-xl font-bold text-neutral-50">
                        New Habit
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* ── Tabs ────────────────────────────────────── */}
                <div className="mb-5 flex gap-1 rounded-xl bg-neutral-800/60 p-1">
                    <button
                        onClick={() => setTab("templates")}
                        className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${tab === "templates"
                                ? "bg-primary-500 text-white shadow-sm"
                                : "text-neutral-400 hover:text-neutral-200"
                            }`}
                    >
                        ✨ Templates
                    </button>
                    <button
                        onClick={() => setTab("custom")}
                        className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${tab === "custom"
                                ? "bg-primary-500 text-white shadow-sm"
                                : "text-neutral-400 hover:text-neutral-200"
                            }`}
                    >
                        🛠 Custom
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {/* ── Template Tab ─────────────────────────────── */}
                    {tab === "templates" && (
                        <motion.div
                            key="templates"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            {/* Category filter */}
                            <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                <button
                                    onClick={() => setTemplateFilter("all")}
                                    className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all ${templateFilter === "all"
                                            ? "bg-primary-500/20 text-primary-400"
                                            : "text-neutral-500 hover:text-neutral-300"
                                        }`}
                                >
                                    All
                                </button>
                                {(Object.keys(CATEGORY_META) as HabitCategory[]).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setTemplateFilter(cat)}
                                        className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all ${templateFilter === cat
                                                ? "bg-primary-500/20 text-primary-400"
                                                : "text-neutral-500 hover:text-neutral-300"
                                            }`}
                                    >
                                        {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                                    </button>
                                ))}
                            </div>

                            {/* Template cards */}
                            <div className="grid gap-2 max-h-[50vh] overflow-y-auto pr-1">
                                {filteredTemplates.map((t, i) => {
                                    const TIcon = getIcon(t.icon);
                                    const meta = CATEGORY_META[t.category];
                                    return (
                                        <motion.button
                                            key={t.name}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            onClick={() => handleTemplateAdd(t)}
                                            className="flex items-center gap-3 rounded-xl border border-neutral-700/60 bg-neutral-800/40 p-3 text-left transition-all hover:border-primary-500/30 hover:bg-neutral-800/80 active:scale-[0.98]"
                                        >
                                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${t.color === "primary" ? "bg-primary-500/15" :
                                                    t.color === "secondary" ? "bg-secondary-500/15" : "bg-accent-500/15"
                                                }`}>
                                                <TIcon className={`h-5 w-5 ${t.color === "primary" ? "text-primary-400" :
                                                        t.color === "secondary" ? "text-secondary-400" : "text-accent-400"
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-neutral-100">{t.name}</p>
                                                <p className="truncate text-xs text-neutral-500">{t.description}</p>
                                            </div>
                                            <span className="flex-shrink-0 text-[10px] text-neutral-600">
                                                {meta.emoji}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Custom Tab ───────────────────────────────── */}
                    {tab === "custom" && (
                        <motion.div
                            key="custom"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.15 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label htmlFor="habit-name" className="mb-1.5 block text-sm font-medium text-neutral-400">
                                        Habit Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        ref={nameRef}
                                        id="habit-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (error) setError("");
                                        }}
                                        maxLength={40}
                                        placeholder="e.g. Morning Meditation"
                                        className={`w-full rounded-xl border bg-neutral-800/60 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 ${error && submitted ? "border-red-500/60" : "border-neutral-700"}`}
                                    />
                                    {error && submitted && (
                                        <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>
                                    )}
                                    <p className="mt-1 text-right text-xs text-neutral-600">{name.length}/40</p>
                                </div>

                                {/* Icon picker */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-400">Icon</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {ICON_OPTIONS.map((ic) => {
                                            const Ic = getIcon(ic);
                                            return (
                                                <button
                                                    key={ic}
                                                    type="button"
                                                    onClick={() => setIcon(ic)}
                                                    aria-label={ic}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${icon === ic ? "border-primary-500/60 bg-primary-500/15 text-primary-400" : "border-neutral-700 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"}`}
                                                >
                                                    <Ic className="h-4 w-4" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Color + Category row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-neutral-400">Color</label>
                                        <div className="flex gap-2">
                                            {COLOR_OPTIONS.map((co) => (
                                                <button
                                                    key={co.value}
                                                    type="button"
                                                    onClick={() => setColor(co.value)}
                                                    aria-label={co.label}
                                                    className={`h-8 w-8 rounded-full ${co.classes} transition-all ${color === co.value ? "ring-2 ring-white/60 scale-110" : "opacity-50 hover:opacity-80"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="habit-category" className="mb-1.5 block text-sm font-medium text-neutral-400">
                                            Category
                                        </label>
                                        <select
                                            id="habit-category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value as HabitCategory)}
                                            className="w-full rounded-xl border border-neutral-700 bg-neutral-800/60 px-3 py-2 text-sm text-neutral-100 outline-none transition-colors focus:border-primary-500/50"
                                        >
                                            {CATEGORY_OPTIONS.map((co) => (
                                                <option key={co.value} value={co.value}>{co.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Goal + Reminder row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="habit-goal" className="mb-1.5 block text-sm font-medium text-neutral-400">
                                            Goal (days)
                                        </label>
                                        <input
                                            id="habit-goal"
                                            type="number"
                                            min={1}
                                            max={365}
                                            value={goalDays}
                                            onChange={(e) => setGoalDays(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-full rounded-xl border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-neutral-100 outline-none transition-colors focus:border-primary-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="habit-reminder" className="mb-1.5 block text-sm font-medium text-neutral-400">
                                            Reminder
                                        </label>
                                        <input
                                            id="habit-reminder"
                                            type="time"
                                            value={reminderTime}
                                            onChange={(e) => setReminderTime(e.target.value)}
                                            className="w-full rounded-xl border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-neutral-100 outline-none transition-colors focus:border-primary-500/50"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="habit-desc" className="mb-1.5 block text-sm font-medium text-neutral-400">
                                        Description
                                    </label>
                                    <textarea
                                        id="habit-desc"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={2}
                                        maxLength={120}
                                        placeholder="Optional — what does this habit look like?"
                                        className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors focus:border-primary-500/50"
                                    />
                                </div>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full rounded-xl bg-primary-500 py-3 font-semibold text-neutral-950 shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-400 hover:shadow-primary-400/25"
                                >
                                    Create Habit
                                </motion.button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
