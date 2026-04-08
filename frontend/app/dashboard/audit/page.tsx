"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
} from "lucide-react";
import {
  type AuditLogItem,
  type AuditLogsResponse,
} from "@/services/audit.service";
import { api } from "@/services/api";

const SKELETON_ROWS = Array.from({ length: 6 }, (_, index) => index);

function getTimestamp(log: AuditLogItem) {
  return log.timestamp || log.createdAt || "";
}

function formatTimestamp(value: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTaskTitle(log: AuditLogItem) {
  return log.task?.title || log.taskTitle || "Untitled task";
}

function getActorName(log: AuditLogItem) {
  return log.actor?.name?.trim() || "Unknown";
}

function getActorEmail(log: AuditLogItem) {
  return log.actor?.email || "No email";
}

function actionBadgeStyle(actionType: string) {
  switch (actionType) {
    case "TASK_CREATED":
      return "border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-200";
    case "TASK_DELETED":
      return "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-200";
    case "TASK_UPDATED":
    case "TASK_PRIORITY_CHANGED":
      return "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-200";
    default:
      return "border-slate-500/30 bg-slate-500/15 text-slate-700 dark:text-slate-200";
  }
}

function extractComparisonPairs(details: Record<string, unknown>) {
  const record = details as Record<string, unknown>;
  const directOld =
    record.oldValue ??
    record.old ??
    record.previous ??
    record.before ??
    record.from;
  const directNew =
    record.newValue ??
    record.new ??
    record.current ??
    record.after ??
    record.to;

  if (typeof directOld !== "undefined" || typeof directNew !== "undefined") {
    return [{ label: "Value", oldValue: directOld, newValue: directNew }];
  }

  const changes = record.changes;
  if (changes && typeof changes === "object" && !Array.isArray(changes)) {
    return Object.entries(changes as Record<string, unknown>).map(
      ([field, value]) => {
        const item = value as Record<string, unknown>;
        return {
          label: field,
          oldValue:
            item.oldValue ??
            item.old ??
            item.previous ??
            item.before ??
            item.from,
          newValue:
            item.newValue ?? item.new ?? item.current ?? item.after ?? item.to,
        };
      },
    );
  }

  return [];
}

function prettyValue(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "undefined") return "N/A";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function DetailList({ details }: { details: Record<string, unknown> }) {
  return (
    <div className="grid gap-2">
      {Object.entries(details).map(([key, value]) => (
        <div
          key={key}
          className="rounded-lg border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/50"
        >
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {key}
          </p>
          <pre className="whitespace-pre-wrap wrap-break-word text-sm text-slate-800 dark:text-slate-200">
            {prettyValue(value)}
          </pre>
        </div>
      ))}
    </div>
  );
}

function AuditDetails({ log }: { log: AuditLogItem }) {
  const details =
    log.details &&
    typeof log.details === "object" &&
    !Array.isArray(log.details)
      ? (log.details as Record<string, unknown>)
      : null;

  if (!details) {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-300">
        No detail payload available for this event.
      </p>
    );
  }

  if (
    log.actionType === "TASK_UPDATED" ||
    log.actionType === "TASK_PRIORITY_CHANGED"
  ) {
    const comparisons = extractComparisonPairs(details);

    if (comparisons.length > 0) {
      return (
        <div className="space-y-3">
          {comparisons.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                {item.label}
              </p>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
                    Old Value
                  </p>
                  <p className="mt-1 wrap-break-word">
                    {prettyValue(item.oldValue)}
                  </p>
                </div>
                <div className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                  -&gt;
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <p className="text-xs uppercase text-slate-500 dark:text-slate-400">
                    New Value
                  </p>
                  <p className="mt-1 wrap-break-word">
                    {prettyValue(item.newValue)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <DetailList details={details} />
        </div>
      );
    }
  }

  if (log.actionType === "TASK_CREATED") {
    const initialTitle =
      typeof details.title === "string" ? details.title : getTaskTitle(log);
    const assignedTo =
      typeof details.assignedTo === "string"
        ? details.assignedTo
        : typeof details.assignee === "string"
          ? details.assignee
          : prettyValue(details.assignedTo ?? details.assignee ?? "N/A");

    return (
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Title
            </p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">
              {initialTitle}
            </p>
          </div>
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Assigned To
            </p>
            <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">
              {assignedTo}
            </p>
          </div>
        </div>
        <DetailList details={details} />
      </div>
    );
  }

  return <DetailList details={details} />;
}

export default function DashboardAuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(
    async (nextPage: number) => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get("accessToken");

        if (!token) {
          setError("Authentication token not found. Please login again.");
          setLogs([]);
          return;
        }

        const { data: response } = await api.get<AuditLogsResponse>("/audit", {
        //   params: { page: Number(nextPage), limit: Number(limit) },
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });

        const sorted = [...response.data].sort((a, b) => {
          const aDate = new Date(getTimestamp(a)).getTime();
          const bDate = new Date(getTimestamp(b)).getTime();
          return bDate - aDate;
        });

        setLogs(sorted);
        setPage(response.page || nextPage);
        setLimit(response.limit || limit);
        setTotalPages(Math.max(response.totalPages || 1, 1));
        setExpandedId(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        } else {
          console.error(error);
        }
        setError("Failed to load audit logs.");
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchAuditLogs(page);
  }, [fetchAuditLogs, page]);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;

    return logs.filter((log) => {
      const actor = `${getActorName(log)} ${getActorEmail(log)}`.toLowerCase();
      const taskTitle = getTaskTitle(log).toLowerCase();
      const action = log.actionType.toLowerCase();

      return (
        actor.includes(query) ||
        taskTitle.includes(query) ||
        action.includes(query)
      );
    });
  }, [logs, search]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 sm:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            Activity Intelligence
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Audit Log Dashboard
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            Track task lifecycle events with full detail payloads, actor
            context, and state-change visibility.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by action, actor, or task title"
              className="w-full rounded-xl border border-slate-300/80 bg-white px-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Activity className="h-4 w-4" />
            <span>Sorted by latest timestamp</span>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Action Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Actor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Task Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950/40">
              {loading
                ? SKELETON_ROWS.map((item) => (
                    <tr key={item}>
                      <td className="px-4 py-4" colSpan={6}>
                        <div className="h-12 animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800/80" />
                      </td>
                    </tr>
                  ))
                : filteredLogs.map((log) => {
                    const expanded = expandedId === log.id;

                    return (
                      <Fragment key={log.id}>
                        <tr
                          onClick={() =>
                            setExpandedId((prev) =>
                              prev === log.id ? null : log.id,
                            )
                          }
                          className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-900/60"
                        >
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                            <span className="line-clamp-1 max-w-45">
                              {log.id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${actionBadgeStyle(log.actionType)}`}
                            >
                              {log.actionType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                            <div className="flex items-start gap-2">
                              <User className="mt-0.5 h-4 w-4 text-slate-400" />
                              <div>
                                <p className="font-medium">
                                  {getActorName(log)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {getActorEmail(log)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                            {getTaskTitle(log)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span>{formatTimestamp(getTimestamp(log))}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setExpandedId((prev) =>
                                  prev === log.id ? null : log.id,
                                );
                              }}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              View Details
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={6} className="p-0">
                            <AnimatePresence initial={false}>
                              {expanded ? (
                                <motion.div
                                  key={`details-${log.id}`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{
                                    duration: 0.25,
                                    ease: "easeInOut",
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="border-t border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                                    <AuditDetails log={log} />
                                  </div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
            </tbody>
          </table>

          {!loading && !filteredLogs.length ? (
            <div className="p-6 text-center text-sm text-slate-600 dark:text-slate-300">
              No audit logs match your search.
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Page {page} of {totalPages} · Limit {limit}
          </p>

          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={loading || page <= 1}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={loading || page >= totalPages}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
