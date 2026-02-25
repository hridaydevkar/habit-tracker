"use client";

import { useState, useMemo } from "react";
import { useHabits } from "@/lib/HabitContext";
import { useToast } from "@/components/Toast";
import HabitCard from "@/components/HabitCard";
import AddHabitModal from "@/components/AddHabitModal";
import NudgeBanner from "@/components/NudgeBanner";
import CelebrationModal from "@/components/CelebrationModal";
import EmptyState from "@/components/EmptyState";
import PullToRefresh from "@/components/PullToRefresh";
import { SortableHabit } from "@/components/SortableHabit";
import { CATEGORY_META } from "@/lib/habitTemplates";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { HabitCategory } from "@/types/habit";
import {
  Plus,
  Flame,
  Target,
  CheckCircle2,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Zap,
  Star,
} from "lucide-react";

// ── Greeting helper ─────────────────────────────────────

function getGreeting(hour: number) {
  if (hour < 5) return { text: "Good Night", icon: Moon, emoji: "🌙" };
  if (hour < 12) return { text: "Good Morning", icon: Sunrise, emoji: "🌅" };
  if (hour < 17) return { text: "Good Afternoon", icon: Sun, emoji: "☀️" };
  if (hour < 21) return { text: "Good Evening", icon: Sunset, emoji: "🌇" };
  return { text: "Good Night", icon: Moon, emoji: "🌙" };
}

// ── Skeleton loader ─────────────────────────────────────

function HabitSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-neutral-800" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-28 rounded bg-neutral-800" />
          <div className="h-3 w-20 rounded bg-neutral-800" />
        </div>
        <div className="h-11 w-11 rounded-full bg-neutral-800" />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-2 w-3 rounded bg-neutral-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
          </div>
        ))}
      </div>
      <div className="mt-3 h-1 rounded-full bg-neutral-800" />
    </div>
  );
}

// ── Progress ring ───────────────────────────────────────

function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  const pct = Math.round(progress * 100);

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
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="stroke-primary-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-neutral-50">{pct}%</span>
        <span className="text-[10px] text-neutral-500">today</span>
      </div>
    </div>
  );
}

// ── Level XP Bar ────────────────────────────────────────

function LevelBar({
  level,
  levelName,
  currentLevelPoints,
  nextLevelAt,
  points,
}: {
  level: number;
  levelName: string;
  currentLevelPoints: number;
  nextLevelAt: number;
  points: number;
}) {
  const progress = nextLevelAt > 0 ? Math.min(1, currentLevelPoints / nextLevelAt) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6 animate-level-glow rounded-2xl border border-primary-500/20 bg-neutral-900/60 p-4 backdrop-blur-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/20">
            <Star className="h-4 w-4 text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-50">
              Level {level} · {levelName}
            </p>
            <p className="text-[10px] text-neutral-500">{points} total XP</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary-500/10 px-2.5 py-1">
          <Zap className="h-3 w-3 text-primary-400" />
          <span className="text-xs font-bold text-primary-400">
            {currentLevelPoints}/{nextLevelAt > 0 ? nextLevelAt : "MAX"} XP
          </span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// ── Stagger variants ────────────────────────────────────

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// ── TodayView ───────────────────────────────────────────

export default function TodayView() {
  const { habitsWithStats, stats, gameState, reorderHabits, currentDate } = useHabits();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<HabitCategory | "all">("all");
  const [hydrated, setHydrated] = useState(false);

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredHabits.findIndex((h) => h.id === active.id);
      const newIndex = filteredHabits.findIndex((h) => h.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(filteredHabits, oldIndex, newIndex);
        reorderHabits(reordered.map((h) => h.id));
        toast("Habits reordered", "success");
      }
    }
  };

  // Detect hydration
  useState(() => {
    setHydrated(true);
  });

  const greeting = getGreeting(currentDate.getHours());

  const dateStr = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Category tabs — only show categories that have habits
  const activeCategories = useMemo(() => {
    const cats = new Set(habitsWithStats.map((h) => h.category));
    return Array.from(cats).sort();
  }, [habitsWithStats]);

  const filteredHabits = useMemo(() => {
    if (categoryFilter === "all") return habitsWithStats;
    return habitsWithStats.filter((h) => h.category === categoryFilter);
  }, [habitsWithStats, categoryFilter]);

  const todayCompleted = useMemo(
    () => habitsWithStats.filter((h) => h.todayCompleted).length,
    [habitsWithStats],
  );

  const todayProgress =
    habitsWithStats.length > 0 ? todayCompleted / habitsWithStats.length : 0;

  // Show skeleton while not hydrated
  if (!hydrated) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl px-5 pb-28 pt-10">
        <div className="mb-6">
          <div className="mb-2 h-4 w-40 animate-pulse rounded bg-neutral-800" />
          <div className="h-8 w-56 animate-pulse rounded bg-neutral-800" />
        </div>
        <div className="mb-6 h-20 animate-pulse rounded-2xl bg-neutral-800/40" />
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-800/40" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <HabitSkeleton />
          <HabitSkeleton />
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh>
      <div className="mx-auto min-h-screen max-w-2xl px-5 pb-28 pt-10">
        {/* ── Header ─────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
          role="banner"
        >
          <time 
            className="mb-1 text-sm font-medium text-neutral-500" 
            dateTime={currentDate.toISOString().split('T')[0]}
            suppressHydrationWarning
          >
            {dateStr}currentDate
          </time>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-neutral-50">
            <span>{greeting.text}</span>
            <span aria-hidden="true" className="text-3xl">{greeting.emoji}</span>
          </h1>
        </motion.header>

        {/* ── Level bar ──────────────────────────────────── */}
        <LevelBar
          level={gameState.level}
          levelName={gameState.levelName}
          currentLevelPoints={gameState.currentLevelPoints}
          nextLevelAt={gameState.nextLevelAt}
          points={gameState.points}
        />

        {/* ── Nudge banner ───────────────────────────────── */}
        <NudgeBanner />

        {/* ── Stats row ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8 grid grid-cols-3 gap-3"
          role="region"
          aria-label="Daily statistics"
        >
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-4 text-center backdrop-blur-sm">
            <CheckCircle2 className="mx-auto mb-1.5 h-5 w-5 text-primary-400" aria-hidden="true" />
            <p className="text-xl font-bold text-neutral-50" aria-label={`${todayCompleted} of ${habitsWithStats.length} habits completed today`}>
              {todayCompleted}/{habitsWithStats.length}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
              Today
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-4 text-center backdrop-blur-sm">
            <Flame className="mx-auto mb-1.5 h-5 w-5 text-secondary-400" aria-hidden="true" />
            <p className="text-xl font-bold text-neutral-50" aria-label={`${stats.currentStreak} day streak`}>
              {stats.currentStreak}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
              Streak
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-4 text-center backdrop-blur-sm">
            <Target className="mx-auto mb-1.5 h-5 w-5 text-accent-400" />
            <p className="text-xl font-bold text-neutral-50">
              {Math.round(stats.completionRate * 100)}%
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
              Rate
            </p>
          </div>
        </motion.div>

        {/* ── Progress ring + message ────────────────────── */}
        {habitsWithStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40 py-6 backdrop-blur-sm"
          >
            <ProgressRing progress={todayProgress} />
            <p className="text-sm text-neutral-400">
              {todayProgress >= 1
                ? "🎉 All habits completed! Amazing work!"
                : todayProgress >= 0.5
                  ? "💪 Great momentum — keep going!"
                  : todayCompleted > 0
                    ? "✨ Nice start — you've got this!"
                    : "🚀 Start your day strong!"}
            </p>
            {!gameState.dailyChallengeCompleted && habitsWithStats.length >= 3 && new Date().getHours() < 12 && (
              <p className="flex items-center gap-1 text-xs text-accent-400">
                <Zap className="h-3 w-3" />
                Daily Challenge: Complete 3 habits before noon for +5 XP!
              </p>
            )}
            {gameState.dailyChallengeCompleted && gameState.dailyChallengeDate === new Date().toISOString().split("T")[0] && (
              <p className="flex items-center gap-1 text-xs text-primary-400">
                <CheckCircle2 className="h-3 w-3" />
                ⚡ Daily Challenge completed! +5 bonus XP earned
              </p>
            )}
          </motion.div>
        )}

        {/* ── Category filter pills ─────────────────────── */}
        {activeCategories.length > 1 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Filter habits by category">
            <button
              onClick={() => setCategoryFilter("all")}
              role="tab"
              aria-selected={categoryFilter === "all"}
              aria-controls="habits-list"
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 ${categoryFilter === "all"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-700/60"
                }`}
            >
              All
            </button>
            {activeCategories.map((cat) => {
              const meta = CATEGORY_META[cat as HabitCategory];
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat as HabitCategory)}
                  role="tab"
                  aria-selected={categoryFilter === cat}
                  aria-controls="habits-list"
                  className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 ${categoryFilter === cat
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-700/60"
                    }`}
                >
                  <span aria-hidden="true">{meta?.emoji}</span> {meta?.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Habit grid ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {habitsWithStats.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredHabits.map((h) => h.id)}
                strategy={verticalListSortingStrategy}
              >
                <motion.div
                  id="habits-list"
                  key={categoryFilter}
                  variants={listContainer}
                  initial="hidden"
                  animate="show"
                  className="grid gap-4 sm:grid-cols-2"
                  role="tabpanel"
                  aria-label="Habits list"
                >
                  {filteredHabits.map((h) => (
                    <SortableHabit key={h.id} id={h.id}>
                      <HabitCard habit={h} />
                    </SortableHabit>
                  ))}
                  {filteredHabits.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-neutral-500" role="status">
                      No habits in this category
                    </div>
                  )}
                </motion.div>
              </SortableContext>
            </DndContext>
          ) : (
            <EmptyState variant="habits" onAction={() => setModalOpen(true)} />
          )}
        </AnimatePresence>

        {/* ── FAB ────────────────────────────────────────── */}
        <motion.button
          onClick={() => setModalOpen(true)}
          aria-label="Add new habit"
          title="Add new habit"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-24 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 shadow-xl shadow-primary-500/30 transition-colors hover:bg-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
        >
          <Plus className="h-6 w-6 text-neutral-950" aria-hidden="true" />
          <span className="sr-only">Add new habit</span>
        </motion.button>

        {/* ── Modal ──────────────────────────────────────── */}
        <AddHabitModal open={modalOpen} onClose={() => setModalOpen(false)} />

        {/* ── Celebration overlay ─────────────────────────── */}
        <CelebrationModal />
      </div>
    </PullToRefresh>
  );
}
