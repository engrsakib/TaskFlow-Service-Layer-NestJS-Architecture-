"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Edit3,
  Eye,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usersService, type UserItem } from "@/services/users.service";

type ModalMode = "details" | "edit" | "delete" | "role" | null;
type ToastType = "success" | "error";

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 18 },
};

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const skeletonRows = Array.from({ length: 6 }, (_, index) => index);

function getInitials(name: string | null | undefined, email: string) {
  const source = name?.trim() || email.split("@")[0];
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function normalizeRole(role: string) {
  return role.toUpperCase();
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-200">
      {children}
    </span>
  );
}

export default function DashboardUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [roleValue, setRoleValue] = useState<"USER" | "ADMIN">("USER");
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const currentIsAdmin = normalizeRole(currentUser?.role || "") === "ADMIN";

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersService.getUsers();
      const sortedUsers = [...data].sort((a, b) => {
        const aHasName = Boolean(a.name?.trim());
        const bHasName = Boolean(b.name?.trim());

        if (aHasName && !bHasName) return -1;
        if (!aHasName && bHasName) return 1;

        const aLabel = (a.name || a.email).toLowerCase();
        const bLabel = (b.name || b.email).toLowerCase();
        return aLabel.localeCompare(bLabel);
      });

      setUsers(sortedUsers);
    } catch {
      showToast("error", "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const email = item.email.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [search, users]);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setEditName("");
    setEditPhone("");
  };

  const openDetails = async (item: UserItem) => {
    try {
      const detail = await usersService.getUserById(item.id);
      setSelectedUser(detail);
      setActiveModal("details");
    } catch {
      showToast("error", "Unable to load user details.");
    }
  };

  const openEdit = (item: UserItem) => {
    setSelectedUser(item);
    setEditName(item.name || "");
    setEditPhone(item.phone || "");
    setActiveModal("edit");
  };

  const openRole = (item: UserItem) => {
    setSelectedUser(item);
    setRoleValue(normalizeRole(item.role) === "ADMIN" ? "ADMIN" : "USER");
    setActiveModal("role");
  };

  const openDelete = (item: UserItem) => {
    setSelectedUser(item);
    setActiveModal("delete");
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    if (!editName.trim() || !editPhone.trim()) {
      showToast("error", "Name and phone are required.");
      return;
    }

    try {
      await usersService.updateUser(selectedUser.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
      });
      showToast("success", "Profile updated successfully.");
      closeModal();
      await fetchUsers();
    } catch {
      showToast("error", "Failed to update profile.");
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;

    if (!currentIsAdmin) {
      showToast("error", "Only ADMIN users can manage roles.");
      return;
    }

    try {
      await usersService.updateUserRole(selectedUser.id, { role: roleValue });
      showToast("success", "User role updated successfully.");
      closeModal();
      await fetchUsers();
    } catch {
      showToast("error", "Failed to update role.");
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await usersService.deleteUser(selectedUser.id);
      showToast("success", "User deleted successfully.");
      closeModal();
      await fetchUsers();
    } catch {
      showToast("error", "Failed to delete user.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            User Management
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            All Users
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Search, update profiles, inspect details, manage roles, and delete users with administrative control.
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
            <thead className="bg-slate-50/80 dark:bg-slate-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading
                ? skeletonRows.map((row) => (
                    <tr key={row} className="animate-pulse">
                      <td className="px-6 py-5">
                        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="space-y-2">
                            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-3 w-44 rounded bg-slate-200 dark:bg-slate-800" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-9 w-44 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                : filteredUsers.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.28, delay: index * 0.03 }}
                      className="hover:bg-slate-50/70 dark:hover:bg-white/5"
                    >
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                        {item.id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-cyan-500/10 text-sm font-semibold text-cyan-700 ring-1 ring-cyan-500/20 dark:text-cyan-200">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt={item.name || item.email}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(item.name, item.email)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {item.name || "N/A"}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                        {item.phone || "N/A"}
                      </td>
                      <td className="px-6 py-5">
                        <Badge>{item.role}</Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => openDetails(item)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:text-cyan-200"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:text-cyan-200"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => openRole(item)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:text-cyan-200"
                            disabled={!currentIsAdmin}
                          >
                            <Shield className="h-4 w-4" />
                            Role
                          </button>
                          <button
                            onClick={() => openDelete(item)}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:border-rose-400 hover:text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:text-rose-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredUsers.length === 0 ? (
          <div className="border-t border-slate-200 px-6 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No users found for your search.
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {activeModal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-slate-100"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {activeModal === "details" && selectedUser ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">User Details</h3>
                  <div className="grid gap-3 text-sm">
                    <DetailRow label="ID" value={selectedUser.id} />
                    <DetailRow label="Name" value={selectedUser.name || "N/A"} />
                    <DetailRow label="Email" value={selectedUser.email} />
                    <DetailRow label="Phone" value={selectedUser.phone || "N/A"} />
                    <DetailRow label="Role" value={selectedUser.role} />
                  </div>
                </div>
              ) : null}

              {activeModal === "edit" ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Edit Profile</h3>
                  <div className="space-y-3">
                    <Field label="Name">
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                        placeholder="Enter name"
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        value={editPhone}
                        onChange={(event) => setEditPhone(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                        placeholder="Enter phone"
                      />
                    </Field>
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
                  >
                    Save Changes
                  </button>
                </div>
              ) : null}

              {activeModal === "role" ? (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Manage Role</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Only ADMIN can manage user roles.
                  </p>
                  <Field label="Role">
                    <div className="relative">
                      <select
                        value={roleValue}
                        onChange={(event) =>
                          setRoleValue(event.target.value as "USER" | "ADMIN")
                        }
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </Field>
                  <button
                    onClick={handleRoleUpdate}
                    disabled={!currentIsAdmin}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Update Role
                  </button>
                </div>
              ) : null}

              {activeModal === "delete" && selectedUser ? (
                <div className="space-y-5">
                  <h3 className="text-2xl font-semibold">Delete User</h3>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedUser.name || selectedUser.email}
                    </span>
                    ? This action cannot be undone.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={closeModal}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="fixed right-4 top-4 z-60 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className={`min-w-64 rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-900/60">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}



