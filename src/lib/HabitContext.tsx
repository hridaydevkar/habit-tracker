"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type {
    Habit,
    HabitLog,
    Achievement,
    UserStats,
    HabitWithStats,
    WeeklyDataPoint,
    GameState,
    UserSettings,
} from "@/types";
import {
    getHabits,
    saveHabits,
    getLogs,
    saveLogs,
    getAchievements,
    saveAchievements,
    getGameState,
    saveGameState,
    getSettings,
    saveSettings,
    initialiseIfNeeded,
    formatDate,
    getLogsByHabit,
    computeLevel,
} from "@/lib/storage";

// ── Context shape ───────────────────────────────────────

interface HabitContextValue {
    // State
    habits: Habit[];
    logs: HabitLog[];
    achievements: Achievement[];
    currentDate: Date;
    gameState: GameState;
    settings: UserSettings;

    // Mutations
    addHabit: (habit: Omit<Habit, "id" | "createdAt">) => void;
    deleteHabit: (id: string) => void;
    reorderHabits: (newOrder: string[]) => void;
    toggleHabitCompletion: (habitId: string, date?: Date) => void;
    updateSettings: (s: Partial<UserSettings>) => void;

    // Computed helpers
    getHabitStreak: (habitId: string) => number;
    getLongestStreak: (habitId: string) => number;
    getCompletionRate: (habitId: string) => number;
    isCompletedToday: (habitId: string) => boolean;
    getWeeklyData: (habitId: string) => WeeklyDataPoint[];
    habitsWithStats: HabitWithStats[];
    stats: UserStats;

    // Event flags
    lastMilestone: string | null;
    clearMilestone: () => void;
}

const HabitContext = createContext<HabitContextValue | null>(null);

// ── Provider ────────────────────────────────────────────

export function HabitProvider({ children }: { children: React.ReactNode }) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [gameState, setGameState] = useState<GameState>(() => ({
        points: 0,
        level: 1,
        levelName: "Seedling",
        currentLevelPoints: 0,
        nextLevelAt: 50,
        dailyChallengeCompleted: false,
    }));
    const [settings, setSettings] = useState<UserSettings>({
        soundEnabled: false,
        animationsEnabled: true,
        nudgesEnabled: true,
        theme: "dark",
        firstDayOfWeek: "monday",
        largerText: false,
    });
    const [currentDate] = useState(() => new Date());
    const [hydrated, setHydrated] = useState(false);
    const [lastMilestone, setLastMilestone] = useState<string | null>(null);
    const [prevCompletedCount, setPrevCompletedCount] = useState(0);

    // ── Hydrate from localStorage on mount ──────────────
    useEffect(() => {
        initialiseIfNeeded();
        setHabits(getHabits());
        setLogs(getLogs());
        setAchievements(getAchievements());
        setGameState(getGameState());
        setSettings(getSettings());
        setHydrated(true);
    }, []);

    // ── Persist on change (skip initial hydration) ──────
    useEffect(() => {
        if (!hydrated) return;
        saveHabits(habits);
    }, [habits, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        saveLogs(logs);
    }, [logs, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        saveAchievements(achievements);
    }, [achievements, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        saveGameState(gameState);
    }, [gameState, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        saveSettings(settings);
    }, [settings, hydrated]);

    // ── Mutations ───────────────────────────────────────

    const addHabit = useCallback(
        (data: Omit<Habit, "id" | "createdAt">) => {
            const habit: Habit = {
                ...data,
                id: crypto.randomUUID(),
                createdAt: new Date(),
            };
            setHabits((prev) => [...prev, habit]);
        },
        [],
    );

    const deleteHabit = useCallback((id: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
        setLogs((prev) => prev.filter((l) => l.habitId !== id));
    }, []);

    const reorderHabits = useCallback((newOrder: string[]) => {
        setHabits((prev) => {
            const ordered = newOrder
                .map((id) => prev.find((h) => h.id === id))
                .filter((h): h is Habit => h !== undefined);
            return ordered;
        });
    }, []);

    const toggleHabitCompletion = useCallback(
        (habitId: string, date?: Date) => {
            const target = formatDate(date ?? currentDate);

            setLogs((prev) => {
                const idx = prev.findIndex(
                    (l) => l.habitId === habitId && formatDate(l.date) === target,
                );

                if (idx >= 0) {
                    // Toggle existing log
                    const updated = [...prev];
                    const existing = updated[idx];
                    if (existing.completed) {
                        // Remove the log entirely (un-complete) — subtract points
                        updated.splice(idx, 1);
                        setGameState((g) => {
                            const newPoints = Math.max(0, g.points - 1);
                            const lvl = computeLevel(newPoints);
                            return { ...g, points: newPoints, ...lvl };
                        });
                    } else {
                        updated[idx] = {
                            ...existing,
                            completed: true,
                            completedAt: new Date(),
                        };
                        // Award points
                        awardPoints(habitId);
                    }
                    return updated;
                }

                // Create new completed log
                awardPoints(habitId);
                return [
                    ...prev,
                    {
                        habitId,
                        date: date ?? currentDate,
                        completed: true,
                        completedAt: new Date(),
                    },
                ];
            });
        },
        [currentDate],
    );

    // ── Points engine ───────────────────────────────────

    const awardPoints = useCallback((habitId: string) => {
        setGameState((g) => {
            let pts = 1; // base point

            // Streak bonus: check how many days this habit has been consecutive
            // (simple heuristic: use current game points as proxy for streak bonus)
            const streakBonus = Math.floor(g.points / 20) * 0.5;
            pts += Math.min(streakBonus, 5); // cap at 5 bonus

            const newPoints = g.points + pts;
            const prevLevel = g.level;
            const lvl = computeLevel(newPoints);

            // Check for level up
            if (lvl.level > prevLevel) {
                setLastMilestone(`🎉 Level Up! You're now a ${lvl.levelName}!`);
                // Haptic feedback on mobile
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                    navigator.vibrate([100, 50, 100]);
                }
            }

            return {
                ...g,
                points: newPoints,
                ...lvl,
                dailyChallengeDate: formatDate(new Date()),
            };
        });

        // Haptic feedback for completion
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(50);
        }
        // Keep habitId signature used
        void habitId;
    }, []);

    const updateSettings = useCallback((partial: Partial<UserSettings>) => {
        setSettings((prev) => ({ ...prev, ...partial }));
    }, []);

    const clearMilestone = useCallback(() => setLastMilestone(null), []);

    // ── Streak calculation ────────────────────────────────

    const getHabitStreak = useCallback(
        (habitId: string): number => {
            const habitLogs = getLogsByHabit(logs, habitId)
                .filter((l) => l.completed)
                .map((l) => formatDate(l.date))
                .sort()
                .reverse(); // newest first

            if (habitLogs.length === 0) return 0;

            const uniqueDays = [...new Set(habitLogs)];
            const todayStr = formatDate(currentDate);

            const startDate =
                uniqueDays[0] === todayStr
                    ? currentDate
                    : (() => {
                        const yesterday = new Date(currentDate);
                        yesterday.setDate(yesterday.getDate() - 1);
                        return uniqueDays[0] === formatDate(yesterday)
                            ? yesterday
                            : null;
                    })();

            if (!startDate) return 0;

            let streak = 0;
            const d = new Date(startDate);
            while (true) {
                if (uniqueDays.includes(formatDate(d))) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                } else {
                    break;
                }
            }
            return streak;
        },
        [logs, currentDate],
    );

    const getLongestStreak = useCallback(
        (habitId: string): number => {
            const habitLogs = getLogsByHabit(logs, habitId)
                .filter((l) => l.completed)
                .map((l) => formatDate(l.date));

            const uniqueDays = [...new Set(habitLogs)].sort();
            if (uniqueDays.length === 0) return 0;

            let longest = 1;
            let current = 1;

            for (let i = 1; i < uniqueDays.length; i++) {
                const prev = new Date(uniqueDays[i - 1]);
                const curr = new Date(uniqueDays[i]);
                const diffMs = curr.getTime() - prev.getTime();
                const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    current++;
                    longest = Math.max(longest, current);
                } else {
                    current = 1;
                }
            }
            return longest;
        },
        [logs],
    );

    // ── Completion rate ───────────────────────────────────

    const getCompletionRate = useCallback(
        (habitId: string): number => {
            const habit = habits.find((h) => h.id === habitId);
            if (!habit) return 0;

            const daysSinceCreation = Math.max(
                1,
                Math.ceil(
                    (currentDate.getTime() - new Date(habit.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                ),
            );

            const completedDays = new Set(
                getLogsByHabit(logs, habitId)
                    .filter((l) => l.completed)
                    .map((l) => formatDate(l.date)),
            ).size;

            return Math.min(1, completedDays / daysSinceCreation);
        },
        [habits, logs, currentDate],
    );

    // ── Today check ───────────────────────────────────────

    const isCompletedToday = useCallback(
        (habitId: string): boolean => {
            const todayStr = formatDate(currentDate);
            return logs.some(
                (l) =>
                    l.habitId === habitId &&
                    l.completed &&
                    formatDate(l.date) === todayStr,
            );
        },
        [logs, currentDate],
    );

    // ── Weekly data for charts ────────────────────────────

    const getWeeklyData = useCallback(
        (habitId: string): WeeklyDataPoint[] => {
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const result: WeeklyDataPoint[] = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - i);
                const dateStr = formatDate(d);
                const completed = logs.some(
                    (l) =>
                        l.habitId === habitId &&
                        l.completed &&
                        formatDate(l.date) === dateStr,
                )
                    ? 1
                    : 0;
                result.push({
                    day: dayNames[d.getDay()],
                    completed,
                    target: 1,
                });
            }

            return result;
        },
        [logs, currentDate],
    );

    // ── Derived: habits with stats ────────────────────────

    const habitsWithStats: HabitWithStats[] = useMemo(() => {
        return habits
            .filter((h) => !h.archived)
            .map((h) => ({
                ...h,
                currentStreak: getHabitStreak(h.id),
                longestStreak: getLongestStreak(h.id),
                completionRate: getCompletionRate(h.id),
                todayCompleted: isCompletedToday(h.id),
                weeklyData: getWeeklyData(h.id),
            }));
    }, [
        habits,
        getHabitStreak,
        getLongestStreak,
        getCompletionRate,
        isCompletedToday,
        getWeeklyData,
    ]);

    // ── Derived: global stats ─────────────────────────────

    const stats: UserStats = useMemo(() => {
        const activeHabits = habits.filter((h) => !h.archived);
        const completedLogs = logs.filter((l) => l.completed);
        const uniqueDays = new Set(completedLogs.map((l) => formatDate(l.date)));

        let globalCurrentStreak = 0;
        let globalLongestStreak = 0;

        if (activeHabits.length > 0) {
            let tempStreak = 0;
            const d = new Date(currentDate);

            for (let i = 0; i < 365; i++) {
                const dateStr = formatDate(d);
                const allCompleted = activeHabits.every((h) =>
                    logs.some(
                        (l) =>
                            l.habitId === h.id &&
                            l.completed &&
                            formatDate(l.date) === dateStr,
                    ),
                );

                if (allCompleted) {
                    tempStreak++;
                    globalLongestStreak = Math.max(globalLongestStreak, tempStreak);
                    if (i === 0 || globalCurrentStreak > 0) {
                        globalCurrentStreak = tempStreak;
                    }
                } else {
                    if (i > 0) break;
                    tempStreak = 0;
                }
                d.setDate(d.getDate() - 1);
            }
        }

        const totalDays = Math.max(
            1,
            ...activeHabits.map((h) =>
                Math.ceil(
                    (currentDate.getTime() - new Date(h.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                ),
            ),
        );

        return {
            totalHabits: activeHabits.length,
            currentStreak: globalCurrentStreak,
            longestStreak: globalLongestStreak,
            completionRate:
                activeHabits.length > 0
                    ? completedLogs.length / (activeHabits.length * totalDays)
                    : 0,
            totalCompletions: completedLogs.length,
            activeDays: uniqueDays.size,
        };
    }, [habits, logs, currentDate]);

    // ── Milestone detection (all habits done today) ───────

    useEffect(() => {
        if (!hydrated || habitsWithStats.length === 0) return;
        const nowCompleted = habitsWithStats.filter((h) => h.todayCompleted).length;

        // All done!
        if (nowCompleted === habitsWithStats.length && nowCompleted > prevCompletedCount) {
            setLastMilestone("🎉 All habits completed! You crushed it today!");
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate([100, 50, 200]);
            }
        }
        // "On fire" when 3+ completed
        if (nowCompleted >= 3 && prevCompletedCount < 3 && nowCompleted < habitsWithStats.length) {
            setLastMilestone("🔥 You're on fire! Keep the momentum going!");
        }

        setPrevCompletedCount(nowCompleted);
    }, [hydrated, habitsWithStats, prevCompletedCount]);

    // ── Daily challenge check ─────────────────────────────

    useEffect(() => {
        if (!hydrated) return;
        const todayStr = formatDate(currentDate);
        if (gameState.dailyChallengeDate === todayStr && gameState.dailyChallengeCompleted) return;

        const todayCompleted = habitsWithStats.filter((h) => h.todayCompleted).length;
        const hour = new Date().getHours();

        if (todayCompleted >= 3 && hour < 12 && !gameState.dailyChallengeCompleted) {
            setGameState((g) => {
                const newPoints = g.points + 5; // bonus!
                const lvl = computeLevel(newPoints);
                return {
                    ...g,
                    points: newPoints,
                    ...lvl,
                    dailyChallengeCompleted: true,
                    dailyChallengeDate: todayStr,
                };
            });
            setLastMilestone("⚡ Daily Challenge Complete! +5 bonus points!");
        }
    }, [hydrated, habitsWithStats, currentDate, gameState.dailyChallengeCompleted, gameState.dailyChallengeDate]);

    // ── Achievement checks ────────────────────────────────

    useEffect(() => {
        if (!hydrated) return;

        setAchievements((prev) =>
            prev.map((a) => {
                if (a.unlockedAt) return a;

                let met = false;
                const { type, value } = a.requirement;

                switch (type) {
                    case "total":
                        met = logs.filter((l) => l.completed).length >= value;
                        break;
                    case "streak":
                        met = habits.some((h) => getHabitStreak(h.id) >= value);
                        break;
                    case "habit_count":
                        met = habits.filter((h) => !h.archived).length >= value;
                        break;
                    case "perfect_week":
                        met = stats.currentStreak >= 7;
                        break;
                    case "perfect_month":
                        met = stats.currentStreak >= 30;
                        break;
                }

                if (met) {
                    setLastMilestone(`🏆 Achievement Unlocked: ${a.name}!`);
                }

                return met ? { ...a, unlockedAt: new Date() } : a;
            }),
        );
    }, [hydrated, habits, logs, stats, getHabitStreak]);

    // ── Context value (memoised) ──────────────────────────

    const value = useMemo<HabitContextValue>(
        () => ({
            habits,
            logs,
            achievements,
            currentDate,
            gameState,
            settings,
            addHabit,
            deleteHabit,
            reorderHabits,
            toggleHabitCompletion,
            updateSettings,
            getHabitStreak,
            getLongestStreak,
            getCompletionRate,
            isCompletedToday,
            getWeeklyData,
            habitsWithStats,
            stats,
            lastMilestone,
            clearMilestone,
        }),
        [
            habits,
            logs,
            achievements,
            currentDate,
            gameState,
            settings,
            addHabit,
            deleteHabit,
            reorderHabits,
            toggleHabitCompletion,
            updateSettings,
            getHabitStreak,
            getLongestStreak,
            getCompletionRate,
            isCompletedToday,
            getWeeklyData,
            habitsWithStats,
            stats,
            lastMilestone,
            clearMilestone,
        ],
    );

    return (
        <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
    );
}

// ── Hook ────────────────────────────────────────────────

export function useHabits(): HabitContextValue {
    const ctx = useContext(HabitContext);
    if (!ctx) {
        throw new Error("useHabits must be used within a <HabitProvider>");
    }
    return ctx;
}
