"use client";

import { useState, useRef, useCallback } from "react";
import { useHabits } from "@/lib/HabitContext";
import { useTheme, type ThemeMode } from "@/lib/ThemeProvider";
import {
    Settings,
    Volume2,
    VolumeX,
    Sparkles,
    Bell,
    BellOff,
    Sun,
    Moon,
    Monitor,
    Calendar,
    Download,
    Upload,
    Trash2,
    Info,
    Type,
    Eye,
    AlertTriangle,
} from "lucide-react";

// ── Toggle switch (iOS-style) ───────────────────────────

function Toggle({
    enabled,
    onToggle,
    label,
    description,
    iconOn,
    iconOff,
}: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description: string;
    iconOn: React.ReactNode;
    iconOff: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800">
                    {enabled ? iconOn : iconOff}
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-100">{label}</p>
                    <p className="text-xs text-neutral-500">{description}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                className={[
                    "relative h-[30px] w-[52px] flex-shrink-0 rounded-full transition-colors duration-300 ease-in-out",
                    enabled
                        ? "bg-primary-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                        : "bg-neutral-700 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]",
                ].join(" ")}
                role="switch"
                aria-checked={enabled}
                aria-label={label}
            >
                <div
                    className={[
                        "absolute top-[3px] h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_1px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        enabled ? "translate-x-[24px]" : "translate-x-[3px]",
                    ].join(" ")}
                />
            </button>
        </div>
    );
}

// ── Theme selector ──────────────────────────────────────

function ThemeSelector({ value, onChange }: { value: ThemeMode; onChange: (t: ThemeMode) => void }) {
    const options: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
        { mode: "light", icon: Sun, label: "Light" },
        { mode: "dark", icon: Moon, label: "Dark" },
        { mode: "auto", icon: Monitor, label: "Auto" },
    ];

    return (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800">
                    <Eye className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-100">Theme</p>
                    <p className="text-xs text-neutral-500">Choose your preferred look</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {options.map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => onChange(mode)}
                        className={[
                            "flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition-all",
                            value === mode
                                ? "bg-primary-500/15 text-primary-400 ring-1 ring-primary-500/40"
                                : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200",
                        ].join(" ")}
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Day of week selector ────────────────────────────────

function DayOfWeekSelector({
    value,
    onChange,
}: {
    value: "sunday" | "monday";
    onChange: (v: "sunday" | "monday") => void;
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800">
                    <Calendar className="h-5 w-5 text-secondary-400" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-neutral-100">First Day of Week</p>
                    <p className="text-xs text-neutral-500">Used in stats and calendars</p>
                </div>
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as "sunday" | "monday")}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 outline-none transition-colors focus:border-primary-500"
            >
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
            </select>
        </div>
    );
}

// ── Confirm Dialog ──────────────────────────────────────

function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
            <div
                className="mx-4 w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl animate-slide-down"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-100">{title}</h3>
                </div>
                <p className="mb-6 text-sm text-neutral-400">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl bg-neutral-800 py-2.5 text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400"
                    >
                        Reset Everything
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── SettingsView ────────────────────────────────────────

export default function SettingsView() {
    const { settings, updateSettings, gameState, habits, logs } = useHabits();
    const { theme, setTheme } = useTheme();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [importStatus, setImportStatus] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Export data ─────────────────────────────────────
    const handleExport = useCallback(() => {
        const data = {
            version: "1.0.0",
            exportedAt: new Date().toISOString(),
            habits: JSON.parse(localStorage.getItem("habitflow_habits") || "[]"),
            logs: JSON.parse(localStorage.getItem("habitflow_logs") || "[]"),
            achievements: JSON.parse(localStorage.getItem("habitflow_achievements") || "[]"),
            gameState: JSON.parse(localStorage.getItem("habitflow_gameState") || "{}"),
            settings: JSON.parse(localStorage.getItem("habitflow_settings") || "{}"),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `habitflow-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    // ── Import data ─────────────────────────────────────
    const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (!data.habits || !data.logs) {
                    setImportStatus("❌ Invalid file format");
                    return;
                }
                localStorage.setItem("habitflow_habits", JSON.stringify(data.habits));
                localStorage.setItem("habitflow_logs", JSON.stringify(data.logs));
                if (data.achievements) localStorage.setItem("habitflow_achievements", JSON.stringify(data.achievements));
                if (data.gameState) localStorage.setItem("habitflow_gameState", JSON.stringify(data.gameState));
                if (data.settings) localStorage.setItem("habitflow_settings", JSON.stringify(data.settings));
                setImportStatus("✅ Data imported! Reloading...");
                setTimeout(() => window.location.reload(), 1500);
            } catch {
                setImportStatus("❌ Failed to parse file");
            }
        };
        reader.readAsText(file);
        // Reset the input
        e.target.value = "";
    }, []);

    // ── Reset data ──────────────────────────────────────
    const handleReset = useCallback(() => {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("habitflow_"));
        keys.forEach((k) => localStorage.removeItem(k));
        setShowResetConfirm(false);
        window.location.reload();
    }, []);

    // ── Theme change handler ────────────────────────────
    const handleThemeChange = useCallback((t: ThemeMode) => {
        setTheme(t);
        updateSettings({ theme: t });
    }, [setTheme, updateSettings]);

    return (
        <div className="mx-auto min-h-screen max-w-2xl px-5 pb-28 pt-10">
            {/* ── Header ───────────────────────────────────── */}
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800">
                        <Settings className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-50">Settings</h1>
                        <p className="text-sm text-neutral-500">Customize your experience</p>
                    </div>
                </div>
            </header>

            {/* ── Profile summary ──────────────────────────── */}
            <div className="mb-8 rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 to-transparent p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-bold text-neutral-50">
                            Level {gameState.level} · {gameState.levelName}
                        </p>
                        <p className="text-sm text-neutral-400">{gameState.points} total XP earned</p>
                        <p className="mt-1 text-xs text-neutral-500">
                            {habits.length} habits · {logs.filter((l) => l.completed).length} completions
                        </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/20">
                        <span className="text-2xl">
                            {gameState.level >= 8 ? "👑" : gameState.level >= 5 ? "⭐" : gameState.level >= 3 ? "🌱" : "🌰"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Appearance ─────────────────────────────────── */}
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
                Appearance
            </h2>
            <div className="mb-8 space-y-3">
                <ThemeSelector value={theme} onChange={handleThemeChange} />
                <Toggle
                    enabled={settings.largerText}
                    onToggle={() => {
                        const next = !settings.largerText;
                        updateSettings({ largerText: next });
                        if (next) {
                            document.documentElement.setAttribute("data-larger-text", "true");
                        } else {
                            document.documentElement.removeAttribute("data-larger-text");
                        }
                    }}
                    label="Larger Text"
                    description="Increase text size for readability"
                    iconOn={<Type className="h-5 w-5 text-primary-400" />}
                    iconOff={<Type className="h-5 w-5 text-neutral-500" />}
                />
            </div>

            {/* ── Preferences ────────────────────────────────── */}
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
                Preferences
            </h2>
            <div className="mb-8 space-y-3">
                <DayOfWeekSelector
                    value={settings.firstDayOfWeek}
                    onChange={(v) => updateSettings({ firstDayOfWeek: v })}
                />
                <Toggle
                    enabled={settings.soundEnabled}
                    onToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    label="Sound Effects"
                    description="Play a chime on habit completion"
                    iconOn={<Volume2 className="h-5 w-5 text-primary-400" />}
                    iconOff={<VolumeX className="h-5 w-5 text-neutral-500" />}
                />
                <Toggle
                    enabled={settings.animationsEnabled}
                    onToggle={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
                    label="Animations"
                    description="Confetti, celebrations & micro-animations"
                    iconOn={<Sparkles className="h-5 w-5 text-accent-400" />}
                    iconOff={<Sparkles className="h-5 w-5 text-neutral-500" />}
                />
                <Toggle
                    enabled={settings.nudgesEnabled}
                    onToggle={() => updateSettings({ nudgesEnabled: !settings.nudgesEnabled })}
                    label="Smart Nudges"
                    description="Streak warnings, motivational messages & tips"
                    iconOn={<Bell className="h-5 w-5 text-secondary-400" />}
                    iconOff={<BellOff className="h-5 w-5 text-neutral-500" />}
                />
            </div>

            {/* ── Data Management ─────────────────────────────── */}
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
                Data Management
            </h2>
            <div className="mb-8 space-y-3">
                <button
                    onClick={handleExport}
                    className="flex w-full items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm transition-colors hover:border-primary-500/30 hover:bg-neutral-900/80 active:scale-[0.99]"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800">
                        <Download className="h-5 w-5 text-primary-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-neutral-100">Export Data</p>
                        <p className="text-xs text-neutral-500">Download all habits as a JSON backup</p>
                    </div>
                </button>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm transition-colors hover:border-accent-500/30 hover:bg-neutral-900/80 active:scale-[0.99]"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800">
                        <Upload className="h-5 w-5 text-accent-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-neutral-100">Import Data</p>
                        <p className="text-xs text-neutral-500">Restore from a JSON backup file</p>
                    </div>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                />

                {importStatus && (
                    <p className="rounded-xl bg-neutral-800/60 p-3 text-center text-sm text-neutral-300">
                        {importStatus}
                    </p>
                )}

                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 transition-colors hover:border-red-500/40 hover:bg-red-500/10 active:scale-[0.99]"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                        <Trash2 className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-red-300">Reset All Data</p>
                        <p className="text-xs text-red-400/60">Delete everything and start fresh</p>
                    </div>
                </button>
            </div>

            {/* ── About ────────────────────────────────────── */}
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
                About
            </h2>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15">
                        <Info className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-neutral-200">HabitFlow</p>
                        <p className="text-xs text-neutral-500">v2.0.0 · Phase 7</p>
                    </div>
                </div>
                <p className="mt-3 text-xs text-neutral-500">
                    Build atomic habits with gamified tracking, smart nudges, and beautiful analytics.
                    PWA-ready with offline support.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "PWA"].map((tech) => (
                        <span key={tech} className="rounded-lg bg-neutral-800/80 px-2.5 py-1 text-[10px] font-medium text-neutral-400">
                            {tech}
                        </span>
                    ))}
                </div>
                <p className="mt-3 text-xs text-neutral-600">Made with ❤️</p>
            </div>

            {/* ── Reset Confirmation ─────────────────────────── */}
            <ConfirmDialog
                open={showResetConfirm}
                title="Reset All Data?"
                message="This will permanently delete all your habits, logs, achievements, and progress. This action cannot be undone."
                onConfirm={handleReset}
                onCancel={() => setShowResetConfirm(false)}
            />
        </div>
    );
}
