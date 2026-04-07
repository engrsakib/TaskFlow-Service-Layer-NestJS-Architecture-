"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Users, CheckSquare2, Shield, LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";

const menuItems = [
  { label: "All Users", href: "/dashboard/users", icon: Users },
  { label: "All Tasks", href: "/dashboard/tasks", icon: CheckSquare2 },
  { label: "Audit Log", href: "/dashboard/audit", icon: Shield },
];

interface SidebarProps {
  mobileOpen?: boolean;
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  mobileOpen = true,
  mobile = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleLogout = () => {
    authService.logout();
    onClose?.();
    router.push("/");
  };

  const containerClass = mobile
    ? "fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/80 bg-slate-50/50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50"
    : "sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200/80 bg-slate-50/50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 md:block";

  return (
    <motion.aside
      initial={mobile ? { x: -320, opacity: 0 } : { x: -24, opacity: 0 }}
      animate={
        mobile
          ? mobileOpen
            ? { x: 0, opacity: 1 }
            : { x: -320, opacity: 0 }
          : { x: 0, opacity: 1 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.32, ease: "easeOut" }
      }
      className={containerClass}
      aria-label="Dashboard Sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200/80 px-6 py-5 dark:border-white/10">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/12 text-sm font-bold text-cyan-700 ring-1 ring-cyan-500/35 dark:bg-cyan-400/15 dark:text-cyan-300 dark:ring-cyan-400/35">
              TF
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                TaskFlow
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Premium Workspace
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-500/12 text-cyan-700 ring-1 ring-cyan-500/25 dark:bg-cyan-400/15 dark:text-cyan-200 dark:ring-cyan-400/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/6 dark:hover:text-zinc-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-200/80 p-4 dark:border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/6 dark:hover:text-zinc-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
