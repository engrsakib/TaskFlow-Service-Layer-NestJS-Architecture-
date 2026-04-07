"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Ghost, Unlink2 } from "lucide-react";
import { AUTH_CHANGED_EVENT, authService } from "@/services/auth.service";

export default function NotFound() {
  const isLoggedIn = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const onStorage = (event: StorageEvent) => {
        if (event.key === "accessToken" || event.key === "taskflow-auth-ping") {
          onStoreChange();
        }
      };

      window.addEventListener(AUTH_CHANGED_EVENT, onStoreChange);
      window.addEventListener("storage", onStorage);

      return () => {
        window.removeEventListener(AUTH_CHANGED_EVENT, onStoreChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    () => !!authService.getToken(),
    () => false,
  );

  return (
    <main className="relative flex min-h-[calc(100vh-160px)] items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.1),transparent_35%)]" />

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[30vw] font-black leading-none tracking-tight text-slate-400/15 dark:text-slate-700/20">
        404
      </span>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface/80 px-4 py-2 backdrop-blur">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent ring-1 ring-accent/35">
            TF
          </span>
          <span className="text-sm font-semibold text-foreground">
            TaskFlow
          </span>
        </div>

        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{
            duration: 4.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface/75 text-accent shadow-lg shadow-cyan-500/10 backdrop-blur"
        >
          <Ghost className="h-10 w-10" />
          <Unlink2 className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-surface p-0.5 text-accent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Oops! Page Not Found
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-foreground/75 sm:text-base">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-accent-strong"
            >
              Back to Home
            </Link>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                Go to Dashboard
              </Link>
            ) : null}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
