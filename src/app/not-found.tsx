import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            {/* Illustration */}
            <svg viewBox="0 0 200 200" className="mb-6 h-48 w-48" fill="none">
                {/* Magnifying glass */}
                <circle cx="90" cy="85" r="40" stroke="var(--n-600)" strokeWidth="4" opacity="0.6" />
                <line x1="120" y1="115" x2="155" y2="150" stroke="var(--n-600)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
                {/* Question mark inside */}
                <text
                    x="90" y="95" textAnchor="middle"
                    fontSize="36" fontWeight="bold" fill="var(--p-400)" opacity="0.8"
                >?</text>
                {/* Floating dots */}
                <circle cx="45" cy="50" r="3" fill="var(--a-400)" opacity="0.4" />
                <circle cx="150" cy="65" r="2" fill="var(--s-400)" opacity="0.4" />
                <circle cx="60" cy="150" r="2.5" fill="var(--p-400)" opacity="0.4" />
            </svg>

            <h1 className="text-6xl font-black text-neutral-200">404</h1>
            <p className="mt-2 text-lg font-medium text-neutral-400">
                Page not found
            </p>
            <p className="mt-1 text-sm text-neutral-500">
                The page you&apos;re looking for doesn&apos;t exist or was moved.
            </p>

            <Link
                href="/"
                className="mt-8 flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-colors hover:bg-primary-400"
            >
                ← Back to Today
            </Link>
        </div>
    );
}
