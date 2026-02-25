import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { HabitProvider } from "@/lib/HabitContext";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import BottomNav from "@/components/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import SkipToContent from "@/components/SkipToContent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HabitFlow — Micro-Habit Tracker",
  description:
    "Build lasting habits with tiny daily actions. Track streaks, earn achievements, and visualize your growth.",
  manifest: "/manifest.json",
  keywords: ["habit tracker", "productivity", "self-improvement", "goals", "streaks"],
  authors: [{ name: "HabitFlow" }],
  creator: "HabitFlow",
  publisher: "HabitFlow",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HabitFlow",
  },
  openGraph: {
    type: "website",
    title: "HabitFlow — Micro-Habit Tracker",
    description: "Build lasting habits with tiny daily actions.",
    siteName: "HabitFlow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#fdf2f4" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider>
            <HabitProvider>
              <ToastProvider>
                <SkipToContent />
                <InstallPrompt />
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
                <BottomNav />
              </ToastProvider>
            </HabitProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
