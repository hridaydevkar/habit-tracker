"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/lib/HabitContext";
import { X, AlertTriangle, Flame, Zap, Users, Quote } from "lucide-react";

// ── Motivational quotes ─────────────────────────────────

const QUOTES = [
    { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
    { text: "We are what we repeatedly do. Excellence is a habit.", author: "Aristotle" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Motivation gets you going. Habit keeps you growing.", author: "John Maxwell" },
    { text: "Success is the sum of small efforts repeated daily.", author: "Robert Collier" },
];

const SOCIAL_PROOF = [
    "85% of HabitFlow users complete morning habits first",
    "Users with 3+ habits are 2× more likely to maintain streaks",
    "Most successful users check in before 9 AM",
    "People who track habits are 42% more likely to achieve their goals",
];

// ── NudgeBanner ─────────────────────────────────────────

export default function NudgeBanner() {
    const { habitsWithStats, stats, settings } = useHabits();
    const [dismissed, setDismissed] = useState(false);

    const nudge = useMemo(() => {
        if (!settings.nudgesEnabled || habitsWithStats.length === 0) return null;

        const todayDone = habitsWithStats.filter((h) => h.todayCompleted).length;
        const total = habitsWithStats.length;
        const remaining = total - todayDone;

        // Priority 1: Streak warning
        if (stats.currentStreak > 2 && todayDone === 0) {
            return {
                type: "warning" as const,
                icon: AlertTriangle,
                text: `⚠️ Don't break your ${stats.currentStreak}-day streak! Complete a habit now.`,
                color: "border-secondary-500/30 bg-secondary-500/10",
                iconColor: "text-secondary-400",
            };
        }

        // Priority 2: Almost there
        if (todayDone > 0 && remaining > 0 && remaining <= 2) {
            return {
                type: "nudge" as const,
                icon: Zap,
                text: `Almost there! ${remaining} more habit${remaining > 1 ? "s" : ""} to crush today! 💪`,
                color: "border-primary-500/30 bg-primary-500/10",
                iconColor: "text-primary-400",
            };
        }

        // Priority 3: On fire
        if (todayDone >= 3 && remaining > 0) {
            return {
                type: "fire" as const,
                icon: Flame,
                text: `🔥 You're on fire! ${todayDone} habits done already!`,
                color: "border-secondary-500/30 bg-secondary-500/10",
                iconColor: "text-secondary-400",
            };
        }

        // Priority 4: Social proof (random)
        if (todayDone === 0) {
            const proofIdx = Math.floor(Date.now() / 86400000) % SOCIAL_PROOF.length;
            return {
                type: "social" as const,
                icon: Users,
                text: SOCIAL_PROOF[proofIdx],
                color: "border-accent-500/30 bg-accent-500/10",
                iconColor: "text-accent-400",
            };
        }

        // Priority 5: Motivational quote
        if (todayDone > 0 && todayDone < total) {
            const rate = stats.completionRate;
            const quoteIdx = rate > 0.7 ? 0 : rate > 0.5 ? 1 : rate > 0.3 ? 2 : Math.floor(Date.now() / 86400000) % QUOTES.length;
            const q = QUOTES[quoteIdx];
            return {
                type: "quote" as const,
                icon: Quote,
                text: `"${q.text}" — ${q.author}`,
                color: "border-neutral-700 bg-neutral-800/60",
                iconColor: "text-neutral-400",
            };
        }

        return null;
    }, [habitsWithStats, stats, settings.nudgesEnabled]);

    if (!nudge || dismissed) return null;

    const Icon = nudge.icon;

    return (
        <div className={`animate-slide-down mb-6 flex items-center gap-3 rounded-2xl border p-4 ${nudge.color}`}>
            <Icon className={`h-5 w-5 flex-shrink-0 ${nudge.iconColor}`} />
            <p className="flex-1 text-sm font-medium text-neutral-300">{nudge.text}</p>
            <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 rounded-lg p-1 text-neutral-600 transition-colors hover:bg-neutral-700/50 hover:text-neutral-400"
                aria-label="Dismiss"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
