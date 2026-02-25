/**
 * Debounce utility for delaying expensive operations
 */

export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function debounced(...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}

/**
 * Throttle utility for rate-limiting function calls
 */
export function throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return function throttled(...args: Parameters<T>) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            fn(...args);
        }
    };
}
