"use client";

import { useState, useCallback, useRef } from "react";

interface PullToRefreshProps {
    children: React.ReactNode;
}

export default function PullToRefresh({ children }: PullToRefreshProps) {
    const [pulling, setPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const startY = useRef(0);
    const threshold = 80;

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        // Only activate when scrolled to top
        const el = e.currentTarget as HTMLElement;
        if (el.scrollTop > 0) return;
        startY.current = e.touches[0].clientY;
        setPulling(true);
    }, []);

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (!pulling) return;
            const dy = e.touches[0].clientY - startY.current;
            if (dy > 0) {
                setPullDistance(Math.min(dy * 0.4, 120));
            }
        },
        [pulling],
    );

    const handleTouchEnd = useCallback(() => {
        if (pullDistance >= threshold) {
            window.location.reload();
        }
        setPulling(false);
        setPullDistance(0);
    }, [pullDistance]);

    const progress = Math.min(1, pullDistance / threshold);

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative"
        >
            {/* Pull indicator */}
            {pullDistance > 10 && (
                <div
                    className="flex items-center justify-center transition-opacity"
                    style={{ height: pullDistance, opacity: progress }}
                >
                    <div
                        className="h-8 w-8 rounded-full border-2 border-primary-400 border-t-transparent"
                        style={{
                            transform: `rotate(${progress * 360}deg)`,
                            transition: pulling ? "none" : "transform 0.3s",
                        }}
                    />
                </div>
            )}
            {children}
        </div>
    );
}
