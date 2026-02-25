"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "./LoadingSpinner";

// Lazy load heavy chart components
export const LazyAreaChart = dynamic(
    () => import("recharts").then((mod) => ({ default: mod.AreaChart })),
    {
        loading: () => (
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        ),
        ssr: false,
    }
);

export const LazyArea = dynamic(() => import("recharts").then((mod) => ({ default: mod.Area })), {
    ssr: false,
});

export const LazyXAxis = dynamic(() => import("recharts").then((mod) => ({ default: mod.XAxis })), {
    ssr: false,
});

export const LazyYAxis = dynamic(() => import("recharts").then((mod) => ({ default: mod.YAxis })), {
    ssr: false,
});

export const LazyTooltip = dynamic(
    () => import("recharts").then((mod) => ({ default: mod.Tooltip })),
    { ssr: false }
);

export const LazyResponsiveContainer = dynamic(
    () => import("recharts").then((mod) => ({ default: mod.ResponsiveContainer })),
    { ssr: false }
);
