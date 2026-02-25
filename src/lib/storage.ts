import type { Habit, HabitLog, Achievement, GameState, UserSettings } from "@/types";
import { debounce } from "./debounce";

// ── Generic localStorage helpers ────────────────────────

const PREFIX = "habitflow_";

/**
 * Safely retrieve and parse a value from localStorage.
 * Returns `fallback` on any error (missing key, corrupt JSON, SSR).
 */
export function getItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = localStorage.getItem(PREFIX + key);
        if (raw === null) return fallback;
        return JSON.parse(raw, dateReviver) as T;
    } catch {
        console.warn(`[storage] Failed to read "${key}", returning fallback.`);
        return fallback;
    }
}

/**
 * Safely serialise and persist a value to localStorage.
 * Uses per-key debouncing so writes for different keys don't cancel each other.
 */
const debouncedWriters = new Map<string, (value: string) => void>();

function getDebouncedWriter(key: string): (value: string) => void {
    let writer = debouncedWriters.get(key);
    if (!writer) {
        let timerId: ReturnType<typeof setTimeout> | null = null;
        writer = (value: string) => {
            if (timerId) clearTimeout(timerId);
            timerId = setTimeout(() => {
                if (typeof window === "undefined") return;
                try {
                    localStorage.setItem(PREFIX + key, value);
                } catch (err) {
                    console.error(`[storage] Failed to write "${key}":`, err);
                }
                timerId = null;
            }, 300);
        };
        debouncedWriters.set(key, writer);
    }
    return writer;
}

export function setItem<T>(key: string, value: T): void {
    getDebouncedWriter(key)(JSON.stringify(value));
}

/**
 * Remove a key from localStorage.
 */
export function removeItem(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PREFIX + key);
}

// ── Date handling ───────────────────────────────────────

/**
 * JSON.parse reviver that converts ISO-8601 strings back to Date objects.
 * Matches strings like "2025-01-15T00:00:00.000Z".
 */
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function dateReviver(_key: string, value: unknown): unknown {
    if (typeof value === "string" && ISO_DATE_RE.test(value)) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) return d;
    }
    return value;
}

// ── Domain-specific accessors ───────────────────────────

const KEYS = {
    habits: "habits",
    logs: "logs",
    achievements: "achievements",
    gameState: "gameState",
    settings: "settings",
    initialised: "initialised",
} as const;

// Habits
export const getHabits = (): Habit[] => getItem<Habit[]>(KEYS.habits, []);
export const saveHabits = (habits: Habit[]): void =>
    setItem(KEYS.habits, habits);

// Logs
export const getLogs = (): HabitLog[] => getItem<HabitLog[]>(KEYS.logs, []);
export const saveLogs = (logs: HabitLog[]): void => setItem(KEYS.logs, logs);

/**
 * Return logs for a specific date string (YYYY-MM-DD).
 */
export function getLogsByDate(logs: HabitLog[], dateStr: string): HabitLog[] {
    return logs.filter((l) => formatDate(l.date) === dateStr);
}

/**
 * Return logs for a specific habit.
 */
export function getLogsByHabit(logs: HabitLog[], habitId: string): HabitLog[] {
    return logs.filter((l) => l.habitId === habitId);
}

// Achievements
export const getAchievements = (): Achievement[] =>
    getItem<Achievement[]>(KEYS.achievements, []);
export const saveAchievements = (a: Achievement[]): void =>
    setItem(KEYS.achievements, a);

// Game State
const DEFAULT_GAME_STATE: GameState = {
    points: 0,
    level: 1,
    levelName: "Seedling",
    currentLevelPoints: 0,
    nextLevelAt: 50,
    dailyChallengeCompleted: false,
};

export const getGameState = (): GameState =>
    getItem<GameState>(KEYS.gameState, DEFAULT_GAME_STATE);
export const saveGameState = (g: GameState): void =>
    setItem(KEYS.gameState, g);

// User Settings
const DEFAULT_SETTINGS: UserSettings = {
    soundEnabled: false,
    animationsEnabled: true,
    nudgesEnabled: true,
    theme: "dark",
    firstDayOfWeek: "monday",
    largerText: false,
};

export const getSettings = (): UserSettings =>
    getItem<UserSettings>(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (s: UserSettings): void =>
    setItem(KEYS.settings, s);

// ── Level thresholds ────────────────────────────────────

const LEVELS: { level: number; name: string; minPoints: number }[] = [
    { level: 1, name: "Seedling", minPoints: 0 },
    { level: 2, name: "Sprout", minPoints: 50 },
    { level: 3, name: "Sapling", minPoints: 150 },
    { level: 4, name: "Growing", minPoints: 300 },
    { level: 5, name: "Blooming", minPoints: 500 },
    { level: 6, name: "Flourishing", minPoints: 750 },
    { level: 7, name: "Thriving", minPoints: 1100 },
    { level: 8, name: "Legendary", minPoints: 1500 },
    { level: 9, name: "Master", minPoints: 2000 },
    { level: 10, name: "Transcendent", minPoints: 3000 },
];

export function computeLevel(points: number): {
    level: number;
    levelName: string;
    currentLevelPoints: number;
    nextLevelAt: number;
} {
    let current = LEVELS[0];
    for (const l of LEVELS) {
        if (points >= l.minPoints) current = l;
        else break;
    }
    const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
    const nextLevel = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;
    return {
        level: current.level,
        levelName: current.name,
        currentLevelPoints: points - current.minPoints,
        nextLevelAt: nextLevel ? nextLevel.minPoints - current.minPoints : 0,
    };
}

// ── Date utilities ──────────────────────────────────────

/** Format a Date (or date-like value) as YYYY-MM-DD */
export function formatDate(d: Date | string): string {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toISOString().split("T")[0];
}

/** Get today as YYYY-MM-DD */
export function today(): string {
    return formatDate(new Date());
}

// ── Sample data & first-run initialisation ──────────────

const SAMPLE_HABITS: Habit[] = [
    {
        id: "h1",
        name: "Morning Meditation",
        icon: "Brain",
        color: "accent",
        category: "mindfulness",
        createdAt: new Date(),
        goalDays: 21,
        reminderTime: "07:00",
        description: "5 minutes of focused breathing",
    },
    {
        id: "h2",
        name: "Drink Water",
        icon: "GlassWater",
        color: "primary",
        category: "health",
        createdAt: new Date(),
        goalDays: 30,
        description: "8 glasses throughout the day",
    },
    {
        id: "h3",
        name: "Read 10 Pages",
        icon: "BookOpen",
        color: "secondary",
        category: "learning",
        createdAt: new Date(),
        goalDays: 66,
        reminderTime: "21:00",
        description: "Read before bed",
    },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    // ── Milestone ───────────────────────────────────────
    {
        id: "a1",
        name: "First Step",
        description: "Complete your first habit",
        icon: "Footprints",
        category: "milestone",
        requirement: { type: "total", value: 1 },
    },
    {
        id: "a6",
        name: "Centurion",
        description: "Log 100 total completions",
        icon: "Sparkles",
        category: "milestone",
        requirement: { type: "total", value: 100 },
    },
    {
        id: "a9",
        name: "Half-Century",
        description: "Log 50 total completions",
        icon: "Medal",
        category: "milestone",
        requirement: { type: "total", value: 50 },
    },
    // ── Streak Master ───────────────────────────────────
    {
        id: "a2",
        name: "7-Day Warrior",
        description: "Reach a 7-day streak on any habit",
        icon: "Flame",
        category: "streak_master",
        requirement: { type: "streak", value: 7 },
    },
    {
        id: "a5",
        name: "Month Master",
        description: "Maintain a 30-day streak on any habit",
        icon: "Crown",
        category: "streak_master",
        requirement: { type: "streak", value: 30 },
    },
    {
        id: "a10",
        name: "Fortnight Fighter",
        description: "Reach a 14-day streak on any habit",
        icon: "Swords",
        category: "streak_master",
        requirement: { type: "streak", value: 14 },
    },
    // ── Consistency King ─────────────────────────────────
    {
        id: "a4",
        name: "Perfect Week",
        description: "Complete every habit for 7 days straight",
        icon: "Trophy",
        category: "consistency_king",
        requirement: { type: "perfect_week", value: 1 },
    },
    {
        id: "a8",
        name: "Perfect Month",
        description: "Complete every habit for 30 days straight",
        icon: "CalendarCheck",
        category: "consistency_king",
        requirement: { type: "perfect_month", value: 1 },
    },
    // ── Collector ───────────────────────────────────────
    {
        id: "a3",
        name: "Habit Collector",
        description: "Track 5 habits at once",
        icon: "LayoutGrid",
        category: "collector",
        requirement: { type: "habit_count", value: 5 },
    },
    {
        id: "a7",
        name: "Triple Threat",
        description: "Track 3 habits at once",
        icon: "Layers",
        category: "collector",
        requirement: { type: "habit_count", value: 3 },
    },
];

/**
 * Call once on app boot. Seeds sample data if this is the first run.
 * Also migrates stale achievement definitions when the schema changes.
 * Returns `true` if fresh data was seeded.
 */
export function initialiseIfNeeded(): boolean {
    const isNew = !getItem<boolean>(KEYS.initialised, false);

    if (isNew) {
        saveHabits(SAMPLE_HABITS);
        saveLogs([]);
        saveAchievements(DEFAULT_ACHIEVEMENTS);
        setItem(KEYS.initialised, true);
        return true;
    }

    // Migrate achievements: if any stored achievement is missing `category`,
    // merge the new definitions in while preserving unlock timestamps.
    const stored = getAchievements();
    const needsMigration = stored.some((a) => !a.category);
    if (needsMigration) {
        const unlockMap = new Map(
            stored.filter((a) => a.unlockedAt).map((a) => [a.id, a.unlockedAt]),
        );
        const merged = DEFAULT_ACHIEVEMENTS.map((def) => ({
            ...def,
            unlockedAt: unlockMap.get(def.id),
        }));
        saveAchievements(merged);
    }

    return false;
}
