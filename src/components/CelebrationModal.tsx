"use client";

import { useEffect, useState, useCallback } from "react";
import { useHabits } from "@/lib/HabitContext";
import { playLevelUpFanfare } from "@/lib/sounds";

// ── Confetti rain particle ──────────────────────────────

interface RainParticle {
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
    rotation: number;
}

function ConfettiRain() {
    const colors = ["#10b981", "#f59e0b", "#a855f7", "#3b82f6", "#ef4444", "#ec4899", "#06b6d4"];
    const particles: RainParticle[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.5 + Math.random() * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-sm"
                    style={{
                        left: `${p.x}%`,
                        top: -20,
                        width: p.size,
                        height: p.size * 0.6,
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `confetti-rain ${p.duration}s ease-in ${p.delay}s forwards`,
                    }}
                />
            ))}
        </div>
    );
}

// ── CelebrationModal ────────────────────────────────────

export default function CelebrationModal() {
    const { lastMilestone, clearMilestone, settings } = useHabits();
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");

    const dismiss = useCallback(() => {
        setVisible(false);
        setTimeout(clearMilestone, 300);
    }, [clearMilestone]);

    useEffect(() => {
        if (lastMilestone && settings.animationsEnabled) {
            setMessage(lastMilestone);
            setVisible(true);
            if (settings.soundEnabled) playLevelUpFanfare();

            // Auto-dismiss after 3.5s
            const timer = setTimeout(dismiss, 3500);
            return () => clearTimeout(timer);
        }
    }, [lastMilestone, settings.animationsEnabled, settings.soundEnabled, dismiss]);

    if (!visible) return null;

    // Pick emoji based on message
    const emoji = message.includes("Level") ? "⭐" : message.includes("Achievement") ? "🏆" : message.includes("fire") ? "🔥" : "🎉";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={dismiss}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in" />

            {/* Confetti */}
            <ConfettiRain />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-4 px-8 animate-in fade-in">
                <div className="animate-bounce-once text-7xl">{emoji}</div>
                <div className="max-w-xs rounded-2xl border border-primary-500/30 bg-neutral-900/90 px-6 py-4 text-center shadow-2xl shadow-primary-500/20 backdrop-blur-md">
                    <p className="text-lg font-bold text-neutral-50">{message}</p>
                    <p className="mt-2 text-xs text-neutral-500">Tap anywhere to dismiss</p>
                </div>
            </div>
        </div>
    );
}
