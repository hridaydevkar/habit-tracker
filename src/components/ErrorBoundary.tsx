"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

// ── Error Boundary ──────────────────────────────────────

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: unknown) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
                    {/* Error icon */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="h-10 w-10 text-red-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-neutral-100">Something went wrong</h1>
                    <p className="mt-2 max-w-md text-sm text-neutral-400">
                        We encountered an unexpected error. Try refreshing the page or go back home.
                    </p>

                    {/* Error details (for dev) */}
                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <details className="mt-4 max-w-lg rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-left">
                            <summary className="cursor-pointer text-xs font-mono text-neutral-500">
                                Error details
                            </summary>
                            <pre className="mt-2 overflow-auto text-xs text-red-400">
                                {this.state.error.message}
                            </pre>
                        </details>
                    )}

                    {/* Actions */}
                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={this.handleGoHome}
                            className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700"
                        >
                            <Home className="h-4 w-4" />
                            Go Home
                        </button>
                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-colors hover:bg-primary-400"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
