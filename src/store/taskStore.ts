import { create } from "zustand";
import { TaskService, taskService } from "../services/taskService";
import {
  Task,
  TaskFilters,
  TaskInput,
  TaskPatch,
  TaskPriority,
  TaskStatus,
} from "../types/task";
import { DEFAULT_FILTERS } from "../utils/filterTasks";

export type LoadStatus = "idle" | "loading" | "ready" | "error";

export interface TaskState {
  tasks: Task[];
  status: LoadStatus;
  error: string | null;
  mutationError: string | null;
  filters: TaskFilters;
  loadTasks: () => Promise<void>;
  createTask: (input: TaskInput) => Promise<boolean>;
  updateTask: (id: string, patch: TaskPatch) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  dismissError: () => void;
  setQuery: (query: string) => void;
  setStatusFilter: (status: TaskStatus | "all") => void;
  setPriorityFilter: (priority: TaskPriority | "all") => void;
  clearFilters: () => void;
}

const messageOf = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

/** Factory so tests (and a future real API) can inject a different service. */
export const createTaskStore = (service: TaskService) =>
  create<TaskState>()((set, get) => {
    /** Runs a mutation; records a user-facing error and resolves to success. */
    const mutate = async (
      op: () => Promise<void>,
      fallback: string
    ): Promise<boolean> => {
      set({ mutationError: null });
      try {
        await op();
        return true;
      } catch (e) {
        set({ mutationError: messageOf(e, fallback) });
        return false;
      }
    };

    return {
      tasks: [],
      status: "idle",
      error: null,
      mutationError: null,
      filters: DEFAULT_FILTERS,

      loadTasks: async () => {
        set({ status: "loading", error: null });
        try {
          set({ tasks: await service.list(), status: "ready" });
        } catch (e) {
          set({ status: "error", error: messageOf(e, "Failed to load tasks") });
        }
      },

      createTask: (input) =>
        mutate(async () => {
          const task = await service.create(input);
          set((s) => ({ tasks: [task, ...s.tasks] }));
        }, "Could not create the task"),

      updateTask: (id, patch) =>
        mutate(async () => {
          const updated = await service.update(id, patch);
          set((s) => ({
            tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
          }));
        }, "Could not update the task"),

      toggleStatus: async (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return false;
        return get().updateTask(id, {
          status: task.status === "pending" ? "completed" : "pending",
        });
      },

      deleteTask: (id) =>
        mutate(async () => {
          await service.remove(id);
          set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        }, "Could not delete the task"),

      dismissError: () => set({ mutationError: null }),
      setQuery: (query) => set((s) => ({ filters: { ...s.filters, query } })),
      setStatusFilter: (status) =>
        set((s) => ({ filters: { ...s.filters, status } })),
      setPriorityFilter: (priority) =>
        set((s) => ({ filters: { ...s.filters, priority } })),
      clearFilters: () => set({ filters: DEFAULT_FILTERS }),
    };
  });

export const useTaskStore = createTaskStore(taskService);
