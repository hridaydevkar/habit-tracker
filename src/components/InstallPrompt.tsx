"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already dismissed this session
        if (sessionStorage.getItem("hf_install_dismissed")) {
            setDismissed(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Register service worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(() => {
                // SW registration failed — silently ignore
            });
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem("hf_install_dismissed", "1");
    };

    if (!deferredPrompt || dismissed) return null;

    return (
        <div className="fixed left-4 right-4 top-4 z-[60] mx-auto max-w-md animate-slide-down rounded-2xl border border-primary-500/30 bg-neutral-900/95 p-4 shadow-2xl shadow-primary-500/10 backdrop-blur-xl sm:left-auto sm:right-6 sm:top-6 sm:max-w-sm">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/20">
                    <Download className="h-5 w-5 text-primary-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-100">Install HabitFlow</p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Add to your home screen for offline access and a native app experience.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={handleInstall}
                            className="rounded-lg bg-primary-500 px-4 py-1.5 text-xs font-semibold text-neutral-950 transition-colors hover:bg-primary-400 active:scale-95"
                        >
                            Install
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
                        >
                            Not now
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 rounded-lg p-1 text-neutral-600 transition-colors hover:text-neutral-400"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
