"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { AUTH_CHANGED_EVENT, authService } from "@/services/auth.service";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const syncToken = () => setHasToken(!!authService.getToken());
    syncToken();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "accessToken" || event.key === "taskflow-auth-ping") {
        syncToken();
      }
    };

    window.addEventListener(AUTH_CHANGED_EVENT, syncToken);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncToken);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push("/");
  };

  const getInitials = (email: string) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-sm font-bold text-accent ring-1 ring-accent/40">
              TF
            </span>
            <span className="text-lg font-semibold tracking-wide text-foreground transition-colors group-hover:text-accent">
              TaskFlow
            </span>
          </Link>
          <Link
            href="/"
            className="hidden rounded-full px-3 py-2 text-sm text-foreground/80 transition hover:bg-surface-muted hover:text-foreground sm:inline-flex"
          >
            Home
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-accent/35 bg-accent/10 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/15 sm:inline-flex"
            >
              Dashboard
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.16 }}
            className="hidden sm:block"
          >
            <Link
              href="/#features"
              className="rounded-full px-4 py-2 text-sm text-foreground/85 transition hover:bg-surface-muted hover:text-foreground"
            >
              Features
            </Link>
          </motion.div>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            transition={{ duration: 0.16 }}
            className="hidden sm:block"
          >
            <Link
              href="/#pricing"
              className="rounded-full px-4 py-2 text-sm text-foreground/85 transition hover:bg-surface-muted hover:text-foreground"
            >
              Pricing
            </Link>
          </motion.div>
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
            transition={{ duration: 0.16 }}
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle Theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground transition hover:border-accent hover:text-accent"
          >
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="block dark:hidden" />
          </motion.button>

          {loading && hasToken ? (
            <div className="h-10 w-10 rounded-full border border-border bg-surface/70" />
          ) : user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="relative h-10 w-10 rounded-full border-2 border-accent bg-accent/10 text-xs font-semibold text-accent transition hover:bg-accent/20"
                aria-label="Open User Menu"
              >
                {getInitials(user.email)}
              </button>

              <AnimatePresence>
                {isDropdownOpen ? (
                  <motion.div
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: -8 }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, scale: 1, y: 0 }
                    }
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-52 rounded-2xl border border-border bg-surface shadow-lg"
                  >
                    <div className="border-b border-border/70 px-4 py-3">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.email}
                      </p>
                      <span className="mt-1 inline-flex rounded-full border border-border/50 bg-surface-muted px-2 py-0.5 text-xs font-semibold text-accent">
                        {user.role}
                      </span>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground/85 transition hover:bg-surface-muted hover:text-foreground"
                      >
                        Go to Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/85 transition hover:bg-surface-muted hover:text-foreground"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
