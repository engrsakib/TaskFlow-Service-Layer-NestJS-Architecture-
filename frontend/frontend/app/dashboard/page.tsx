"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Clock3, ListTodo, Sparkles } from "lucide-react";

const statsOverview = [
  {
    title: "Total Tasks",
    value: "128",
    icon: ListTodo,
    description: "Tasks across all projects",
  },
  {
    title: "Pending",
    value: "34",
    icon: Clock3,
    description: "Needs action this week",
  },
  {
    title: "Completed",
    value: "94",
    icon: CheckCircle2,
    description: "Finished with audit trail",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl border border-white/12 bg-slate-900/50 p-6 backdrop-blur-md sm:p-8"
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
          <Sparkles size={14} /> Premium Workspace
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Welcome back, {user?.email?.split("@")[0] ?? "User"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
          This is your TaskFlow command center. Track progress, monitor pending work,
          and keep your team aligned with audit-ready workflows.
        </p>
      </motion.section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-zinc-100">Stats Overview</h2>
          <p className="mt-1 text-sm text-zinc-400">Real-time operational metrics</p>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid gap-4 md:grid-cols-3"
        >
          {statsOverview.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-2xl border border-white/12 bg-slate-900/40 p-5 backdrop-blur-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-300">{item.title}</p>
                    <p className="mt-3 text-3xl font-semibold text-zinc-50">{item.value}</p>
                    <p className="mt-2 text-xs text-zinc-400">{item.description}</p>
                  </div>
                  <span className="rounded-xl bg-cyan-300/12 p-3 text-cyan-200">
                    <Icon size={20} />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-3xl border border-white/12 bg-slate-900/35 p-6 backdrop-blur-md sm:p-8"
      >
        <h3 className="text-lg font-semibold text-zinc-100">System Overview</h3>
        <p className="mt-2 text-sm text-zinc-300">
          Manage users, tasks, and audit events from the left navigation. Use this
          dashboard to keep delivery predictable and accountability visible.
        </p>
      </motion.section>
    </motion.div>
  );
}
