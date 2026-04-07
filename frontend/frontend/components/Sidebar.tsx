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
    ? "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-900/50 backdrop-blur-md"
    : "sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-slate-900/50 backdrop-blur-md md:block";

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
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.32, ease: "easeOut" }}
      className={containerClass}
      aria-label="Dashboard Sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/15 text-sm font-bold text-cyan-300 ring-1 ring-cyan-400/35">
              TF
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-100">TaskFlow</p>
              <p className="text-xs text-zinc-400">Premium Workspace</p>
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
                    ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/25"
                    : "text-zinc-300 hover:bg-white/6 hover:text-zinc-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/6 hover:text-zinc-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
