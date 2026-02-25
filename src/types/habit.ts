// ── Habit Types ─────────────────────────────────────────

/** Predefined color themes mapped to Tailwind palette tokens */
export type HabitColor = "primary" | "secondary" | "accent";

/** Habit categories for grouping and filtering */
export type HabitCategory =
    | "health"
    | "fitness"
    | "mindfulness"
    | "productivity"
    | "learning"
    | "social"
    | "creative"
    | "other";

export interface Habit {
    id: string;
    name: string;
    icon: string;               // lucide icon name, e.g. "Dumbbell"
    color: HabitColor;
    category: HabitCategory;
    createdAt: Date;
    goalDays: number;            // target streak length (e.g. 21, 66)
    reminderTime?: string;       // HH:mm format, optional
    description?: string;
    archived?: boolean;
}

// ── Habit Log ───────────────────────────────────────────

export interface HabitLog {
    habitId: string;
    date: Date;                  // calendar day the log belongs to
    completed: boolean;
    note?: string;               // optional reflection / note
    completedAt?: Date;          // exact timestamp of completion
}

// ── Achievements ────────────────────────────────────────

/** The metric an achievement is evaluated against */
export type AchievementRequirementType =
    | "streak"          // consecutive-day streak
    | "total"           // total completions across all habits
    | "habit_count"     // number of active habits
    | "perfect_week"    // 7/7 days completed in a week
    | "perfect_month";  // every day in a month

/** Achievement display categories */
export type AchievementCategory =
    | "streak_master"
    | "consistency_king"
    | "collector"
    | "milestone";

export interface AchievementRequirement {
    type: AchievementRequirementType;
    value: number;      // threshold to unlock (e.g. streak ≥ 7)
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;                        // lucide icon name
    requirement: AchievementRequirement;
    category?: AchievementCategory;       // display grouping
    unlockedAt?: Date;                   // undefined → still locked
}

// ── User Stats ──────────────────────────────────────────

export interface UserStats {
    totalHabits: number;
    currentStreak: number;       // days in a row with ≥ 1 completion
    longestStreak: number;
    completionRate: number;      // 0 – 1 ratio
    totalCompletions: number;
    activeDays: number;          // unique days with any completion
}

// ── Convenience / Derived ───────────────────────────────

export interface WeeklyDataPoint {
    day: string;                 // "Mon", "Tue", …
    completed: number;
    target: number;
}

export interface HabitWithStats extends Habit {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    todayCompleted: boolean;
    weeklyData: WeeklyDataPoint[];
}

// ── Gamification ────────────────────────────────────────

export interface GameState {
    points: number;
    level: number;
    levelName: string;
    currentLevelPoints: number;   // points earned within this level
    nextLevelAt: number;          // total points needed for next level
    dailyChallengeCompleted: boolean;
    dailyChallengeDate?: string;  // YYYY-MM-DD of last check
}

// ── User Settings ───────────────────────────────────────

export interface UserSettings {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    nudgesEnabled: boolean;
    theme: "light" | "dark" | "auto";
    firstDayOfWeek: "sunday" | "monday";
    largerText: boolean;
}

