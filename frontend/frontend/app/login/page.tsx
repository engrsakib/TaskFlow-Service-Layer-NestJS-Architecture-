"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (isSignUp) {
      setErrorMessage("Sign up is not connected yet. Please use Login.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      await authService.login({
        email: normalizedEmail,
        password: normalizedPassword,
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(6,182,212,0.14),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(244,63,94,0.12),transparent_30%)]" />

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface/90 p-6 shadow-2xl shadow-zinc-300/20 backdrop-blur dark:shadow-black/30 sm:p-8"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          {isSignUp ? "Create Your Account" : "Welcome Back"}
        </h1>
        <p className="mt-2 text-sm text-foreground/80">
          {isSignUp
            ? "Sign up to start managing tasks and team workflows with TaskFlow."
            : "Login to continue managing your workflow with TaskFlow."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-foreground/85"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-foreground outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-foreground/85"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-foreground outline-none transition focus:border-accent"
            />
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-500">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Please wait..."
              : isSignUp
                ? "Sign Up"
                : "Login"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm text-foreground/85">
          <Link href="/" className="transition hover:text-accent">
            Back to Home
          </Link>
          <button
            type="button"
            className="transition hover:text-accent"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              setErrorMessage("");
            }}
          >
            {isSignUp ? "Switch to Login" : "Sign Up"}
          </button>
        </div>
      </motion.section>
    </main>
  );
}

