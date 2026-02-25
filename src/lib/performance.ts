/**
 * Performance monitoring utilities for development
 */

export function measurePerformance(name: string, fn: () => void) {
    if (process.env.NODE_ENV === "development") {
        const start = performance.now();
        fn();
        const end = performance.now();
        console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    } else {
        fn();
    }
}

export function logRender(componentName: string) {
    if (process.env.NODE_ENV === "development") {
        console.log(`[Render] ${componentName} rendered at ${new Date().toISOString()}`);
    }
}

/**
 * Hook to measure component render count (development only)
 */
export function useRenderCount(componentName: string) {
    if (process.env.NODE_ENV === "development") {
        const renderCount = React.useRef(0);
        renderCount.current += 1;
        console.log(`[Render Count] ${componentName}: ${renderCount.current}`);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React = (globalThis as any).React || {};
