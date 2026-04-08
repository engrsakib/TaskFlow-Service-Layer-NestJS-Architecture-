"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  ChartLine,
  ClipboardList,
  GitBranch,
  Lock,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Real-time Tracking",
    description:
      "Monitor task progress instantly with live status and deadlines.",
    icon: ClipboardList,
  },
  {
    title: "Advanced Audit Logs",
    description:
      "Capture every action with transparent, accountable activity history.",
    icon: ShieldCheck,
  },
  {
    title: "Team Collaboration",
    description:
      "Keep conversations, assignments, and updates in one shared workspace.",
    icon: Users,
  },
  {
    title: "Role-based Access",
    description:
      "Control permissions securely for admins, managers, and contributors.",
    icon: Lock,
  },
  {
    title: "Performance Analytics",
    description:
      "Visualize throughput and bottlenecks with actionable team insights.",
    icon: ChartLine,
  },
  {
    title: "Smart Notifications",
    description:
      "Deliver context-aware alerts so teams never miss critical updates.",
    icon: Bell,
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    details: ["Up to 3 projects", "Basic reporting", "Community support"],
  },
  {
    name: "Pro",
    price: "$19/mo",
    details: ["Unlimited projects", "Advanced audit logs", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    details: [
      "Dedicated onboarding",
      "Role-based governance",
      "SLA and custom integrations",
    ],
  },
];

const developerSkills = ["NestJS", "Go", "Python", "AI/ML"];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative flex-1 overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.12),transparent_32%),radial-gradient(circle_at_50%_75%,rgba(16,185,129,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.12),transparent_32%),radial-gradient(circle_at_50%_75%,rgba(16,185,129,0.12),transparent_40%)]" />

      <section className="relative mx-auto w-full max-w-6xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-border bg-surface px-4 py-1 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            AI-Driven Workflow Management
          </p>
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Master Your Workflow, Amplify Productivity
          </motion.h1>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8"
          >
            TaskFlow helps teams prioritize work, reduce delays, and execute
            projects with clarity using an intelligent task management
            experience.
          </motion.p>
          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.02,
                    boxShadow: "0 0 0 8px rgba(34, 211, 238, 0.08)",
                  }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-8"
          >
            <Link
              href="/login"
              className="inline-flex rounded-full bg-accent px-7 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-accent-strong"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Common Workflow Problems Cost Time and Trust
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/80 sm:text-base">
            Teams lose momentum due to missed deadlines, scattered
            communication, and unclear ownership. TaskFlow unifies execution so
            every task has visibility, accountability, and measurable progress.
          </p>
        </motion.div>
      </section>

      <section
        id="features"
        className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <motion.div
          variants={staggerContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={staggerItem}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -4,
                      scale: 1.01,
                      borderColor: "rgba(34, 211, 238, 0.55)",
                    }
              }
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-colors"
            >
              <feature.icon className="mb-4 h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-foreground/80">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-accent uppercase">
              Audit Log Deep Dive
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Accountability Is a Feature, Not an Afterthought
            </h2>
            <p className="mt-4 text-sm leading-7 text-foreground/80 sm:text-base">
              Advanced audit logs are essential for reliable operations,
              especially in distributed teams. TaskFlow keeps a clear timeline
              of who changed what and when, helping teams resolve incidents
              quickly, improve compliance, and build trust in every release.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-muted p-5">
            <ShieldCheck className="h-6 w-6 text-accent" />
            <p className="mt-3 text-sm leading-7 text-foreground/80">
              This section reflects the same engineering principle behind
              service-layer architecture: transparent actions and clean control
              over critical business workflows.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">Integrations</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/80 sm:text-base">
            TaskFlow connects with tools your team already uses to reduce
            context switching and improve execution continuity.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface-muted p-4 text-sm font-medium">
              Slack Integration
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-4 text-sm font-medium">
              Google Calendar Sync
            </div>
            <div className="rounded-xl border border-border bg-surface-muted p-4 text-sm font-medium">
              GitHub Workflow Hooks
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="pricing"
        className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <motion.div
          variants={sectionVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">Pricing</h2>
          <motion.div
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.2 }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            {pricingTiers.map((tier) => (
              <motion.article
                key={tier.name}
                variants={staggerItem}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -4,
                        scale: 1.01,
                        borderColor: "rgba(34, 211, 238, 0.55)",
                      }
                }
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="rounded-2xl border border-border bg-surface p-6 transition-colors"
              >
                <p className="text-sm font-semibold text-accent">{tier.name}</p>
                <p className="mt-2 text-3xl font-bold">{tier.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                  {tier.details.map((detail) => (
                    <li key={detail}>• {detail}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section
        id="about-developer"
        className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <motion.div
          variants={sectionVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-border bg-surface p-6 sm:p-8"
        >
          <p className="text-xs font-semibold tracking-[0.15em] text-accent uppercase">
            About Developer
          </p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Md. Nazmus Sakib
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/80 sm:text-base">
            Md. Nazmus Sakib is passionate about building scalable tools that
            simplify complex workflows. He specializes in NestJS service-layer
            architecture, high-performance systems in Go, robust automation with
            Python, and practical AI/ML solutions that deliver measurable
            business outcomes.
          </p>
          <motion.div
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {developerSkills.map((skill) => (
              <motion.span
                key={skill}
                variants={staggerItem}
                className="inline-flex rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-foreground/85"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Start Building Better Workflows Today
          </h2>
          <p className="mt-3 text-sm leading-7 text-foreground/80 sm:text-base">
            Join teams using TaskFlow to improve execution speed and operational
            clarity.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-accent-strong"
            >
              Sign Up Now
            </Link>
            <form className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email for updates"
                className="w-full rounded-full border border-border bg-surface-muted px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-foreground/70">
            <span className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Guided onboarding support
            </span>
            <span className="inline-flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Simple migration path from legacy tools
            </span>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
