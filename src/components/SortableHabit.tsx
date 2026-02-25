"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// ── Sortable Habit Wrapper ──────────────────────────────

interface SortableHabitProps {
    id: string;
    children: ReactNode;
}

export function SortableHabit({ id, children }: SortableHabitProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
            {children}
        </motion.div>
    );
}
