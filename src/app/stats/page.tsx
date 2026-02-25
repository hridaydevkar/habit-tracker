"use client";

import { useMemo, useState, useEffect } from "react";
import { useHabits } from "@/lib/HabitContext";
import { formatDate } from "@/lib/storage";
import { SkeletonStats, SkeletonChart } from "@/components/LoadingSpinner";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import {
    TrendingUp,
    Flame,
    Target,
    Calendar,
    Trophy,
    ArrowUp,
} from "lucide-react";

// ── Custom Recharts Tooltip ────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-neutral-700/60 bg-neutral-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
            <p className="text-xs text-neutral-400">{label}</p>
            <p className="text-sm font-bold text-primary-400">{payload[0].value}%</p>
        </div>
    );
}

// ── Heatmap Component ──────────────────────────────────

function Heatmap({ data }: { data: { date: string; count: number }[] }) {
    const weeks = useMemo(() => {
        // Group by week columns (last 12 weeks = ~84 days)
        const map = new Map(data.map((d) => [d.date, d.count]));
        const today = new Date();
        const cells: { date: string; count: number; day: number; week: number }[] = [];

        const totalDays = 84;
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (totalDays - 1));

        // Align to the start of the week (Sunday)
        const startDay = startDate.getDay();
        startDate.setDate(startDate.getDate() - startDay);
        const adjustedDays = totalDays + startDay;

        for (let i = 0; i < adjustedDays; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const dateStr = formatDate(d);
            cells.push({
                date: dateStr,
                count: map.get(dateStr) ?? 0,
                day: d.getDay(),
                week: Math.floor(i / 7),
            });
        }

        return cells;
    }, [data]);

    const maxCount = Math.max(1, ...weeks.map((c) => c.count));

    function getIntensity(count: number): string {
        if (count === 0) return "bg-neutral-800/60";
        const ratio = count / maxCount;
        if (ratio <= 0.25) return "bg-primary-900";
        if (ratio <= 0.5) return "bg-primary-700";
        if (ratio <= 0.75) return "bg-primary-500";
        return "bg-primary-400";
    }

    const monthLabels = useMemo(() => {
        const labels: { label: string; week: number }[] = [];
        let lastMonth = -1;
        for (const cell of weeks) {
            if (cell.day !== 0) continue;
            const month = new Date(cell.date).getMonth();
            if (month !== lastMonth) {
                lastMonth = month;
                labels.push({
                    label: new Date(cell.date).toLocaleDateString("en-US", { month: "short" }),
                    week: cell.week,
                });
            }
        }
        return labels;
    }, [weeks]);

    const totalWeeks = Math.max(...weeks.map((c) => c.week)) + 1;

    return (
        <div className="overflow-x-auto">
            {/* Month labels row */}
            <div className="mb-1 flex" style={{ paddingLeft: 28 }}>
                {monthLabels.map((m, i) => (
                    <span
                        key={i}
                        className="text-[10px] text-neutral-500"
                        style={{
                            position: "relative",
                            left: `${(m.week / totalWeeks) * 100}%`,
                            marginRight: 8,
                        }}
                    >
                        {m.label}
                    </span>
                ))}
            </div>
            <div className="flex gap-0.5">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 pr-1 pt-0">
                    {["", "M", "", "W", "", "F", ""].map((l, i) => (
                        <div key={i} className="flex h-3 w-4 items-center justify-end">
                            <span className="text-[9px] text-neutral-600">{l}</span>
                        </div>
                    ))}
                </div>
                {/* Grid */}
                <div className="flex gap-0.5">
                    {Array.from({ length: totalWeeks }, (_, w) => (
                        <div key={w} className="flex flex-col gap-0.5">
                            {Array.from({ length: 7 }, (_, d) => {
                                const cell = weeks.find((c) => c.week === w && c.day === d);
                                if (!cell) return <div key={d} className="h-3 w-3" />;
                                return (
                                    <div
                                        key={d}
                                        className={`h-3 w-3 rounded-[3px] transition-colors ${getIntensity(cell.count)}`}
                                        title={`${cell.date}: ${cell.count} completion${cell.count !== 1 ? "s" : ""}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            {/* Legend */}
            <div className="mt-2 flex items-center justify-end gap-1">
                <span className="text-[10px] text-neutral-600">Less</span>
                {["bg-neutral-800/60", "bg-primary-900", "bg-primary-700", "bg-primary-500", "bg-primary-400"].map((c, i) => (
                    <div key={i} className={`h-3 w-3 rounded-[3px] ${c}`} />
                ))}
                <span className="text-[10px] text-neutral-600">More</span>
            </div>
        </div>
    );
}

// ── Stat Card ──────────────────────────────────────────

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: typeof TrendingUp;
    label: string;
    value: string | number;
    sub?: string;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-neutral-500">{label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-50">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>}
        </div>
    );
}

// ── Per-Habit Breakdown Card ───────────────────────────

function HabitBreakdownCard({
    name,
    streak,
    longestStreak,
    rate,
    color,
}: {
    name: string;
    streak: number;
    longestStreak: number;
    rate: number;
    color: "primary" | "secondary" | "accent";
}) {
    const colorMap = {
        primary: { bar: "bg-primary-500", text: "text-primary-400", bg: "bg-primary-500/10" },
        secondary: { bar: "bg-secondary-500", text: "text-secondary-400", bg: "bg-secondary-500/10" },
        accent: { bar: "bg-accent-500", text: "text-accent-400", bg: "bg-accent-500/10" },
    };
    const c = colorMap[color];

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-neutral-200">{name}</h4>
                <span className={`text-xs font-semibold ${c.text}`}>{Math.round(rate * 100)}%</span>
            </div>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                    className={`h-full rounded-full ${c.bar} transition-all duration-700`}
                    style={{ width: `${Math.round(rate * 100)}%` }}
                />
            </div>
            <div className="flex gap-4 text-xs text-neutral-500">
                <span>🔥 {streak} day streak</span>
                <span>🏆 Best: {longestStreak} days</span>
            </div>
        </div>
    );
}

// ── Main StatsView ─────────────────────────────────────

export default function StatsView() {
    const { stats, habitsWithStats, logs, currentDate } = useHabits();
    const [hydrated, setHydrated] = useState(false);

    // Detect hydration
    useEffect(() => {
        setHydrated(true);
    }, []);

    // 30-day completion rate trend
    const chartData = useMemo(() => {
        const points: { date: string; rate: number }[] = [];
        const totalHabits = habitsWithStats.length;
        if (totalHabits === 0) return points;

        for (let i = 29; i >= 0; i--) {
            const d = new Date(currentDate);
            d.setDate(d.getDate() - i);
            const dateStr = formatDate(d);
            const completed = logs.filter(
                (l) => l.completed && formatDate(l.date) === dateStr,
            ).length;
            const rate = Math.round((completed / totalHabits) * 100);
            points.push({
                date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                rate,
            });
        }
        return points;
    }, [habitsWithStats, logs, currentDate]);

    // Heatmap data (last 90 days)
    const heatmapData = useMemo(() => {
        const result: { date: string; count: number }[] = [];
        for (let i = 89; i >= 0; i--) {
            const d = new Date(currentDate);
            d.setDate(d.getDate() - i);
            const dateStr = formatDate(d);
            const count = logs.filter(
                (l) => l.completed && formatDate(l.date) === dateStr,
            ).length;
            result.push({ date: dateStr, count });
        }
        return result;
    }, [logs, currentDate]);

    // Best performing habits (sorted by completion rate)
    const topHabits = useMemo(
        () => [...habitsWithStats].sort((a, b) => b.completionRate - a.completionRate).slice(0, 3),
        [habitsWithStats],
    );

    // Encouraging message
    const encouragement = useMemo(() => {
        const rate = stats.completionRate;
        if (rate >= 0.9) return { emoji: "🏆", text: "Outstanding! You're in the top tier of consistency." };
        if (rate >= 0.7) return { emoji: "🔥", text: "Great momentum! You're building solid habits." };
        if (rate >= 0.5) return { emoji: "💪", text: "Good progress! Keep pushing to hit your goals." };
        if (rate >= 0.3) return { emoji: "🌱", text: "You're growing! Every completed habit matters." };
        return { emoji: "🚀", text: "Every journey starts with a single step. You've got this!" };
    }, [stats.completionRate]);

    // Loading skeleton
    if (!hydrated) {
        return (
            <div className="mx-auto min-h-screen max-w-2xl px-5 pb-28 pt-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-neutral-50">Statistics</h1>
                    <p className="mt-1 text-sm text-neutral-500">Your progress at a glance</p>
                </header>
                <SkeletonStats />
                <div className="mt-8 space-y-6">
                    <SkeletonChart />
                    <SkeletonChart />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-screen max-w-2xl px-5 pb-28 pt-10">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-neutral-50">Statistics</h1>
                <p className="mt-1 text-sm text-neutral-500">Your progress at a glance</p>
            </header>

            {/* Encouraging message */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-sm">
                <span className="text-3xl">{encouragement.emoji}</span>
                <p className="text-sm font-medium text-neutral-300">{encouragement.text}</p>
            </div>

            {/* Hero stat cards */}
            <div className="mb-8 grid grid-cols-2 gap-3">
                <StatCard icon={Target} label="Total Habits" value={stats.totalHabits} color="bg-primary-500/15 text-primary-400" />
                <StatCard icon={Flame} label="Longest Streak" value={stats.longestStreak} sub="consecutive days" color="bg-secondary-500/15 text-secondary-400" />
                <StatCard icon={TrendingUp} label="Completion Rate" value={`${Math.round(stats.completionRate * 100)}%`} color="bg-accent-500/15 text-accent-400" />
                <StatCard icon={Calendar} label="Days Logged" value={stats.activeDays} sub="unique active days" color="bg-primary-500/15 text-primary-400" />
            </div>

            {/* 30-day chart */}
            {chartData.length > 0 && (
                <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <ArrowUp className="h-4 w-4 text-primary-400" />
                        <h2 className="text-sm font-semibold text-neutral-300">30-Day Trend</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: "#64748b" }}
                                axisLine={false}
                                tickLine={false}
                                interval={6}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "#64748b" }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                tickFormatter={(v: number) => `${v}%`}
                            />
                            <RechartsTooltip content={<ChartTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="rate"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#chartGradient)"
                                dot={false}
                                activeDot={{ r: 4, fill: "#10b981", stroke: "#0f172a", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Heatmap */}
            <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary-400" />
                    <h2 className="text-sm font-semibold text-neutral-300">Activity (Last 3 Months)</h2>
                </div>
                <Heatmap data={heatmapData} />
            </div>

            {/* Best performing */}
            {topHabits.length > 0 && (
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-secondary-400" />
                        <h2 className="text-sm font-semibold text-neutral-300">Top Performers</h2>
                    </div>
                    <div className="space-y-3">
                        {topHabits.map((h) => (
                            <HabitBreakdownCard
                                key={h.id}
                                name={h.name}
                                streak={h.currentStreak}
                                longestStreak={h.longestStreak}
                                rate={h.completionRate}
                                color={h.color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Per-habit breakdown */}
            {habitsWithStats.length > 0 && (
                <div>
                    <h2 className="mb-4 text-sm font-semibold text-neutral-300">All Habits</h2>
                    <div className="space-y-3">
                        {habitsWithStats.map((h) => (
                            <HabitBreakdownCard
                                key={h.id}
                                name={h.name}
                                streak={h.currentStreak}
                                longestStreak={h.longestStreak}
                                rate={h.completionRate}
                                color={h.color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {habitsWithStats.length === 0 && (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-700 py-16 text-center">
                    <TrendingUp className="mb-4 h-12 w-12 text-neutral-700" />
                    <h2 className="mb-1 text-lg font-semibold text-neutral-200">No data yet</h2>
                    <p className="max-w-xs text-sm text-neutral-500">
                        Start completing habits to see your stats appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
