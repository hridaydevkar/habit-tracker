"use client";

import { useCallback } from "react";

interface SwipeHandlers {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

/**
 * Returns touch handlers that detect a left-to-right swipe.
 * `onSwipeRight` fires when the user swipes ≥ 80px horizontally
 * with less than 60px vertical drift.
 */
export function useSwipe(onSwipeRight: () => void): SwipeHandlers {
    let startX = 0;
    let startY = 0;

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    }, []);

    const onTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            const touch = e.changedTouches[0];
            const dx = touch.clientX - startX;
            const dy = Math.abs(touch.clientY - startY);

            // Swipe right: ≥80px horizontal, <60px vertical drift
            if (dx >= 80 && dy < 60) {
                onSwipeRight();
            }
        },
        [onSwipeRight],
    );

    return { onTouchStart, onTouchEnd };
}
