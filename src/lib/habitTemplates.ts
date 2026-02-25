import type { HabitCategory, HabitColor } from "@/types/habit";

// ── Template type ───────────────────────────────────────

export interface HabitTemplate {
    name: string;
    icon: string;
    category: HabitCategory;
    color: HabitColor;
    description: string;
    goalDays: number;
}

// ── Templates ───────────────────────────────────────────

export const HABIT_TEMPLATES: HabitTemplate[] = [
    // Health
    {
        name: "Drink Water",
        icon: "GlassWater",
        category: "health",
        color: "primary",
        description: "Stay hydrated — 8 glasses a day",
        goalDays: 30,
    },
    {
        name: "Sleep 8 Hours",
        icon: "Moon",
        category: "health",
        color: "accent",
        description: "Consistent sleep schedule for better health",
        goalDays: 21,
    },
    {
        name: "Eat Healthy",
        icon: "Apple",
        category: "health",
        color: "primary",
        description: "Choose whole foods over processed ones",
        goalDays: 30,
    },

    // Fitness
    {
        name: "Exercise",
        icon: "Dumbbell",
        category: "fitness",
        color: "secondary",
        description: "30 min of movement — walk, run, or lift",
        goalDays: 30,
    },
    {
        name: "Morning Stretch",
        icon: "Sun",
        category: "fitness",
        color: "secondary",
        description: "5 min stretch to start the day right",
        goalDays: 21,
    },
    {
        name: "10K Steps",
        icon: "Footprints",
        category: "fitness",
        color: "primary",
        description: "Walk 10,000 steps every day",
        goalDays: 30,
    },

    // Mindfulness
    {
        name: "Meditate",
        icon: "Brain",
        category: "mindfulness",
        color: "accent",
        description: "5-10 minutes of mindful breathing",
        goalDays: 21,
    },
    {
        name: "Journaling",
        icon: "Pencil",
        category: "mindfulness",
        color: "accent",
        description: "Write 3 things you're grateful for",
        goalDays: 21,
    },

    // Productivity
    {
        name: "No Social Media",
        icon: "Smartphone",
        category: "productivity",
        color: "secondary",
        description: "Limit scrolling to reclaim your focus",
        goalDays: 30,
    },
    {
        name: "Deep Work",
        icon: "Zap",
        category: "productivity",
        color: "secondary",
        description: "2 hours of focused, uninterrupted work",
        goalDays: 66,
    },

    // Learning
    {
        name: "Read 20 Pages",
        icon: "BookOpen",
        category: "learning",
        color: "primary",
        description: "Read at least 20 pages of a book",
        goalDays: 30,
    },
    {
        name: "Practice Coding",
        icon: "Code",
        category: "learning",
        color: "accent",
        description: "Solve 1 problem or build something small",
        goalDays: 66,
    },
    {
        name: "Learn a Language",
        icon: "Languages",
        category: "learning",
        color: "primary",
        description: "15 minutes of language practice daily",
        goalDays: 30,
    },

    // Creative
    {
        name: "Draw / Sketch",
        icon: "Palette",
        category: "creative",
        color: "accent",
        description: "Express yourself through art every day",
        goalDays: 30,
    },
    {
        name: "Play Music",
        icon: "Music",
        category: "creative",
        color: "secondary",
        description: "Practice an instrument for 15 min",
        goalDays: 30,
    },
];

// ── Category metadata ───────────────────────────────────

export const CATEGORY_META: Record<HabitCategory, { label: string; emoji: string }> = {
    health: { label: "Health", emoji: "🩺" },
    fitness: { label: "Fitness", emoji: "💪" },
    mindfulness: { label: "Mindfulness", emoji: "🧘" },
    productivity: { label: "Productivity", emoji: "⚡" },
    learning: { label: "Learning", emoji: "📚" },
    social: { label: "Social", emoji: "👥" },
    creative: { label: "Creative", emoji: "🎨" },
    other: { label: "Other", emoji: "📌" },
};
