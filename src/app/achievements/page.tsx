"use client";

import { useMemo } from "react";
import { useHabits } from "@/lib/HabitContext";
import type { Achievement, AchievementCategory } from "@/types";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Lock, Trophy } from "lucide-react";

// ── Icon resolver ───────────────────────────────────────

function getIcon(name: string): LucideIcon {
    const icon = (Icons as Record<string, unknown>)[name];
    if (typeof icon === "object" && icon !== null) return icon as LucideIcon;
    return Icons.Circle;
}

// ── Category metadata ───────────────────────────────────

const CATEGORY_META: Record<AchievementCategory, { label: string; emoji: string; gradient: string }> = {
    streak_master: {
        label: "Streak Master",
        emoji: "🔥",
        gradient: "from-secondary-500/20 to-secondary-900/5",
    },
    consistency_king: {
        label: "Consistency King",
        emoji: "👑",
        gradient: "from-accent-500/20 to-accent-900/5",
    },
    collector: {
        label: "Collector",
        emoji: "🗂️",
        gradient: "from-primary-500/20 to-primary-900/5",
    },
    milestone: {
        label: "Milestone",
        emoji: "🏆",
        gradient: "from-secondary-500/20 to-primary-900/5",
    },
};

// ── Progress calculator ─────────────────────────────────

function useAchievementProgress(a: Achievement) {
    const { stats, habitsWithStats, logs } = useHabits();

    return useMemo(() => {
        const { type, value } = a.requirement;
        let current = 0;

        switch (type) {
            case "total":
                current = logs.filter((l) => l.completed).length;
                break;
            case "streak":
                current = Math.max(0, ...habitsWithStats.map((h) => h.currentStreak));
                break;
            case "habit_count":
                current = habitsWithStats.length;
                break;
            case "perfect_week":
                current = Math.min(stats.currentStreak, 7);
                break;
            case "perfect_month":
                current = Math.min(stats.currentStreak, 30);
                break;
        }

        const target = type === "perfect_week" ? 7 : type === "perfect_month" ? 30 : value;
        return { current, target, ratio: Math.min(1, current / target) };
    }, [a.requirement, stats, habitsWithStats, logs]);
}

// ── Achievement Card ────────────────────────────────────

function AchievementCard({ achievement }: { achievement: Achievement }) {
    const Icon = getIcon(achievement.icon);
    const unlocked = !!achievement.unlockedAt;
    const progress = useAchievementProgress(achievement);

    const unlockDate = achievement.unlockedAt
        ? new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })
        : null;

    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
                unlocked
                    ? "border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-neutral-900/80 shadow-lg shadow-primary-500/10"
                    : "border-neutral-800 bg-neutral-900/40",
            ].join(" ")}
        >
            {/* Unlocked badge */}
            {unlocked && (
                <div className="absolute right-3 top-3 rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-bold text-neutral-950 shadow-md shadow-primary-500/30">
                    ✓ DONE
                </div>
            )}

            {/* Icon */}
            <div className="mb-3 flex items-center gap-3">
                <div
                    className={[
                        "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                        unlocked
                            ? "bg-primary-500/20 text-primary-400 shadow-inner"
                            : "bg-neutral-800 text-neutral-600",
                    ].join(" ")}
                >
                    {unlocked ? (
                        <Icon className="h-6 w-6" />
                    ) : (
                        <Lock className="h-5 w-5" />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className={`font-semibold ${unlocked ? "text-neutral-100" : "text-neutral-400"}`}>
                        {achievement.name}
                    </h3>
                    <p className={`text-xs ${unlocked ? "text-neutral-400" : "text-neutral-600"}`}>
                        {achievement.description}
                    </p>
                </div>
            </div>

            {/* Progress or unlock date */}
            {unlocked ? (
                <div className="flex items-center gap-1.5 text-xs text-primary-400/80">
                    <Trophy className="h-3 w-3" />
                    <span>Unlocked {unlockDate}</span>
                </div>
            ) : (
                <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-neutral-500">
                            {progress.current} / {progress.target}
                        </span>
                        <span className="font-medium text-neutral-400">
                            {Math.round(progress.ratio * 100)}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                        <div
                            className="h-full rounded-full bg-neutral-600 transition-all duration-700"
                            style={{ width: `${Math.round(progress.ratio * 100)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Summary Ring ────────────────────────────────────────

function SummaryRing({ unlocked, total }: { unlocked: number; total: number }) {
    const size = 100;
    const strokeWidth = 7;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = total > 0 ? unlocked / total : 0;
    const offset = circumference - progress * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-neutral-800"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="stroke-primary-500 transition-all duration-700"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-neutral-50">{unlocked}</span>
                <span className="text-[10px] text-neutral-500">of {total}</span>
            </div>
        </div>
    );
}

// ── Main AchievementsView ──────────────────────────────

export default function AchievementsView() {
    const { achievements } = useHabits();

    const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

    // Group by category
    const grouped = useMemo(() => {
        const categories: AchievementCategory[] = [
            "milestone",
            "streak_master",
            "consistency_king",
            "collector",
        ];
        return categories
            .map((cat) => ({
                category: cat,
                meta: CATEGORY_META[cat],
                items: achievements.filter((a) => a.category === cat),
            }))
            .filter((g) => g.items.length > 0);
    }, [achievements]);

    // Encouragement
    const message = useMemo(() => {
        const ratio = achievements.length > 0 ? unlockedCount / achievements.length : 0;
        if (ratio >= 1) return "🎉 Incredible! You've unlocked every achievement!";
        if (ratio >= 0.5) return "💪 Over halfway there — keep it up!";
        if (unlockedCount > 0) return "🌱 Great start! More achievements await.";
        return "🚀 Complete habits to start unlocking achievements!";
    }, [unlockedCount, achievements.length]);

    return (
        <div className="mx-auto min-h-screen max-w-2xl px-5 pb-28 pt-10">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-neutral-50">Achievements</h1>
                <p className="mt-1 text-sm text-neutral-500">Earn badges by building great habits</p>
            </header>

            {/* Summary hero */}
            <div className="mb-8 flex items-center gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
                <SummaryRing unlocked={unlockedCount} total={achievements.length} />
                <div>
                    <p className="text-lg font-bold text-neutral-100">
                        {unlockedCount} Unlocked
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">{message}</p>
                </div>
            </div>

            {/* Category groups */}
            {grouped.map((group) => (
                <div key={group.category} className="mb-8">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-lg">{group.meta.emoji}</span>
                        <h2 className="text-sm font-semibold text-neutral-300">{group.meta.label}</h2>
                        <span className="ml-auto text-xs text-neutral-600">
                            {group.items.filter((a) => a.unlockedAt).length}/{group.items.length}
                        </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {group.items.map((a) => (
                            <AchievementCard key={a.id} achievement={a} />
                        ))}
                    </div>
                </div>
            ))}

            {/* Empty state */}
            {achievements.length === 0 && (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-700 py-16 text-center">
                    <Trophy className="mb-4 h-12 w-12 text-neutral-700" />
                    <h2 className="mb-1 text-lg font-semibold text-neutral-200">No achievements yet</h2>
                    <p className="max-w-xs text-sm text-neutral-500">
                        Start tracking habits to earn achievements.
                    </p>
                </div>
            )}
        </div>
    );
}
