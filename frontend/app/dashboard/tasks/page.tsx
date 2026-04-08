"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  tasksService,
  type TaskItem,
  type TaskStatus,
  type TaskPriority,
} from "@/services/tasks.service";
import { usersService, type UserItem } from "@/services/users.service";

type ModalMode = "create" | "edit" | "delete" | null;
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

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05 },
  }),
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

const skeletonRows = Array.from({ length: 6 }, (_, index) => index);

function normalizeRole(role: string) {
  return role.toUpperCase();
}

function getStatusColor(status: TaskStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "DONE":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/10",
        text: "text-emerald-700 dark:text-emerald-200",
        border: "border-emerald-500/20",
      };
    case "PROCESSING":
      return {
        bg: "bg-blue-500/10 dark:bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-200",
        border: "border-blue-500/20",
      };
    case "PENDING":
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/10",
        text: "text-amber-700 dark:text-amber-200",
        border: "border-amber-500/20",
      };
    default:
      return {
        bg: "bg-slate-500/10 dark:bg-slate-500/10",
        text: "text-slate-700 dark:text-slate-200",
        border: "border-slate-500/20",
      };
  }
}

function getPriorityColor(priority: TaskPriority): {
  bg: string;
  text: string;
  border: string;
} {
  switch (priority) {
    case "HIGH":
      return {
        bg: "bg-red-500/10 dark:bg-red-500/10",
        text: "text-red-700 dark:text-red-200",
        border: "border-red-500/20",
      };
    case "MEDIUM":
      return {
        bg: "bg-orange-500/10 dark:bg-orange-500/10",
        text: "text-orange-700 dark:text-orange-200",
        border: "border-orange-500/20",
      };
    case "LOW":
      return {
        bg: "bg-cyan-500/10 dark:bg-cyan-500/10",
        text: "text-cyan-700 dark:text-cyan-200",
        border: "border-cyan-500/20",
      };
    default:
      return {
        bg: "bg-slate-500/10 dark:bg-slate-500/10",
        text: "text-slate-700 dark:text-slate-200",
        border: "border-slate-500/20",
      };
  }
}

interface StatusBadgeProps {
  status: TaskStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const colors = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center rounded-full border ${colors.border} ${colors.bg} px-2.5 py-1 text-xs font-semibold ${colors.text}`}
    >
      {status}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TaskPriority;
}

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colors = getPriorityColor(priority);
  return (
    <span
      className={`inline-flex items-center rounded-full border ${colors.border} ${colors.bg} px-2.5 py-1 text-xs font-semibold ${colors.text}`}
    >
      {priority}
    </span>
  );
}

interface TaskCardProps {
  task: TaskItem;
  index: number;
  assignee: UserItem | undefined;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
}

function TaskCard({ task, index, assignee, onEdit, onDelete }: TaskCardProps) {
  const descriptionTruncated =
    task.description.length > 80
      ? task.description.slice(0, 80) + "..."
      : task.description;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50"
    >
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
            {task.title}
          </h3>
          <div className="ml-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Edit task"
            >
              <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-xs text-slate-600 dark:text-slate-400">
          {descriptionTruncated}
        </p>

        {/* Assignee */}
        {assignee && (
          <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Assignee
            </p>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-700 dark:text-cyan-200">
                {assignee.name
                  ? `${assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}`
                  : assignee.email.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                  {assignee.name || "No name"}
                </p>
                {assignee.phone && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {assignee.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status & Priority */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardTasksPage() {
  const { user: currentUser } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeModal, setActiveModal] = useState<ModalMode>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<TaskStatus>("PENDING");
  const [formPriority, setFormPriority] = useState<TaskPriority>("MEDIUM");
  const [formAssigneeId, setFormAssigneeId] = useState("");

  const currentIsAdmin = normalizeRole(currentUser?.role || "") === "ADMIN";

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const getUpdateErrorMessage = useCallback(
    (
      error: unknown,
      fallbackMessage = "Something went wrong during update",
    ) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message) && message.length > 0) {
          return message[0];
        }

        if (typeof message === "string" && message.trim()) {
          return message;
        }
      }

      return fallbackMessage;
    },
    [],
  );

  const fetchUsers = useCallback(async () => {
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showToast("error", "Failed to fetch users");
    }
  }, [showToast]);

  const fetchTasks = useCallback(
    async (page: number = 1) => {
      try {
        setPaginating(page !== currentPage);
        const response = await tasksService.getTasks(page, 10);

        // Ensure data is an array before setting
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.warn("Tasks data is not an array:", response.data);
          setTasks([]);
        }

        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        showToast("error", "Failed to fetch tasks");
        setTasks([]);
      } finally {
        setLoading(false);
        setPaginating(false);
      }
    },
    [currentPage, showToast],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    void (async () => {
      setLoading(true);
      await Promise.all([fetchTasks(1), fetchUsers()]);
    })();
  }, []);

  // Search filter
  const filteredTasks = useMemo(() => {
    // Ensure tasks is an array before filtering
    if (!Array.isArray(tasks)) {
      console.warn("Tasks is not an array:", tasks);
      return [];
    }

    if (!search.trim()) return tasks;

    const lowerSearch = search.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description.toLowerCase().includes(lowerSearch),
    );
  }, [tasks, search]);

  // Task to user mapping
  const userMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTask(null);
    setFormTitle("");
    setFormDescription("");
    setFormStatus("PENDING");
    setFormPriority("MEDIUM");
    setFormAssigneeId("");
  };

  const openCreateModal = () => {
    setFormTitle("");
    setFormDescription("");
    setFormStatus("PENDING");
    setFormPriority("MEDIUM");
    setFormAssigneeId(users[0]?.id?.toString() || "");
    setActiveModal("create");
  };

  const openEditModal = async (task: TaskItem) => {
    try {
      const fullTask = await tasksService.getTaskById(task.id);
      setSelectedTask(fullTask);
      setFormTitle(fullTask.title);
      setFormDescription(fullTask.description);
      setFormStatus(fullTask.status);
      setFormPriority(fullTask.priority);
      setFormAssigneeId(fullTask.userId.toString());
      setActiveModal("edit");
    } catch (error) {
      console.error("Failed to fetch task details:", error);
      showToast("error", "Failed to load task details");
    }
  };

  const openDeleteModal = (task: TaskItem) => {
    setSelectedTask(task);
    setActiveModal("delete");
  };

  const handleCreateTask = async () => {
    if (!formTitle.trim() || !formDescription.trim() || !formAssigneeId) {
      showToast("error", "Please fill in all fields");
      return;
    }

    const assigneeIdNum = Number(formAssigneeId);
    if (Number.isNaN(assigneeIdNum) || assigneeIdNum <= 0) {
      showToast("error", "Invalid assignee selected");
      return;
    }

    setIsSaving(true);
    try {
      await tasksService.createTask({
        title: formTitle.trim(),
        description: formDescription.trim(),
        status: formStatus,
        priority: formPriority,
        assigneeId: assigneeIdNum,
      });
      showToast("success", "Task created successfully");
      closeModal();
      await fetchTasks(1);
    } catch (error) {
      showToast("error", getUpdateErrorMessage(error, "Failed to create task"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    if (!formTitle.trim() || !formDescription.trim() || !formAssigneeId) {
      showToast("error", "Please fill in all fields");
      return;
    }

    const assigneeIdNum = Number(formAssigneeId);
    if (Number.isNaN(assigneeIdNum) || assigneeIdNum <= 0) {
      showToast("error", "Invalid assignee selected");
      return;
    }

    setIsSaving(true);
    try {
      await tasksService.updateTask(selectedTask.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        status: formStatus,
        priority: formPriority,
        assigneeId: assigneeIdNum,
      });
      showToast("success", "Task updated successfully");
      closeModal();
      await fetchTasks(currentPage);
    } catch (error) {
      showToast("error", getUpdateErrorMessage(error, "Failed to update task"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    setIsSaving(true);
    try {
      await tasksService.deleteTask(selectedTask.id);
      showToast("success", "Task deleted successfully");
      closeModal();
      await fetchTasks(currentPage);
    } catch (error) {
      showToast("error", getUpdateErrorMessage(error, "Failed to delete task"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                toast.type === "success"
                  ? "bg-emerald-500/90 text-white dark:bg-emerald-600/90"
                  : "bg-red-500/90 text-white dark:bg-red-600/90"
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-6 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage and track all project tasks
            </p>
          </div>

          {currentIsAdmin && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skeletonRows.map((index) => (
              <div
                key={index}
                className="h-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 animate-pulse"
              />
            ))}
          </div>
        ) : !Array.isArray(filteredTasks) || filteredTasks.length === 0 ? (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              {search ? "No tasks match your search" : "No tasks yet"}
            </p>
          </div>
        ) : (
          <motion.div
            animate={paginating ? { opacity: 0.5 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  assignee={userMap.get(task.userId)}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => fetchTasks(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || paginating}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => fetchTasks(page)}
                    disabled={paginating}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-cyan-600 text-white"
                        : "border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => fetchTasks(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || paginating}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(activeModal === "create" || activeModal === "edit") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {activeModal === "create" ? "Create Task" : "Edit Task"}
                </h2>
                <button
                  onClick={closeModal}
                  disabled={isSaving}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 p-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    disabled={isSaving}
                    placeholder="Task title"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    disabled={isSaving}
                    placeholder="Task description"
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as TaskStatus)
                    }
                    disabled={isSaving}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) =>
                      setFormPriority(e.target.value as TaskPriority)
                    }
                    disabled={isSaving}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    Assignee
                  </label>
                  <select
                    value={formAssigneeId}
                    onChange={(e) => setFormAssigneeId(e.target.value)}
                    disabled={isSaving}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                  >
                    <option value="">Select assignee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id?.toString()}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-200 dark:border-slate-700 p-4">
                <button
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    activeModal === "create"
                      ? handleCreateTask
                      : handleUpdateTask
                  }
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : activeModal === "create"
                      ? "Create"
                      : "Update"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {activeModal === "delete" && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="space-y-4 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Delete Task?
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete &quot;{selectedTask.title}
                  &quot;? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 border-t border-slate-200 dark:border-slate-700 p-4">
                <button
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
