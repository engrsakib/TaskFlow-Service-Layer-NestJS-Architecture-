"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-sm font-bold text-accent ring-1 ring-accent/40">
            TF
          </span>
          <span className="text-lg font-semibold tracking-wide text-foreground transition-colors group-hover:text-accent">
            TaskFlow
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#features"
            className="hidden rounded-full px-4 py-2 text-sm text-foreground/85 transition hover:bg-surface-muted hover:text-foreground sm:inline-flex"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="hidden rounded-full px-4 py-2 text-sm text-foreground/85 transition hover:bg-surface-muted hover:text-foreground sm:inline-flex"
          >
            Pricing
          </Link>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle Theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground transition hover:border-accent hover:text-accent"
          >
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="block dark:hidden" />
          </button>
          <Link
            href="/login"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Login
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
