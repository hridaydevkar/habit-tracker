"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, CalendarDays, Award, Settings } from "lucide-react";

const TABS = [
    { href: "/", label: "Today", icon: Home },
    { href: "/stats", label: "Stats", icon: BarChart3 },
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/achievements", label: "Awards", icon: Award },
    { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-800/60 bg-neutral-950/80 backdrop-blur-xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            aria-label="Main navigation"
        >
            <div className="mx-auto flex max-w-2xl items-center justify-around">
                {TABS.map((tab) => {
                    const active = pathname === tab.href;
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={[
                                "flex min-h-[52px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-400",
                                active
                                    ? "text-primary-400"
                                    : "text-neutral-500 hover:text-neutral-300",
                            ].join(" ")}
                            aria-current={active ? "page" : undefined}
                            aria-label={`${tab.label} page`}
                        >
                            <Icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                            {tab.label}
                            {active && (
                                <span className="mt-0.5 h-1 w-1 rounded-full bg-primary-400" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
