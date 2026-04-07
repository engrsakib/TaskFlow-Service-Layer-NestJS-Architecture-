"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.08),transparent_35%),linear-gradient(to_bottom,#020617,#09090b)] text-zinc-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-900/50 px-4 py-3 backdrop-blur-md md:hidden"
        >
          <span className="text-sm font-semibold text-zinc-100">TaskFlow Dashboard</span>
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="rounded-lg border border-white/15 bg-white/5 p-2 text-zinc-100 transition hover:bg-white/10"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>

        <AnimatePresence>
          {isSidebarOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/45 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              <Sidebar mobile mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </>
          ) : null}
        </AnimatePresence>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
