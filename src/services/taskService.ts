import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, TaskInput, TaskPatch } from "../types/task";

export const TASKS_KEY = "@taskflow/tasks";

export class TaskServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskServiceError";
  }
}

export interface TaskService {
  list(): Promise<Task[]>;
  create(input: TaskInput): Promise<Task>;
  update(id: string, patch: TaskPatch): Promise<Task>;
  remove(id: string): Promise<void>;
}

export interface TaskServiceOptions {
  list?: Task[];
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** store and retrieve tasks from the storage */

export function createTaskService({
  list = [],
}: TaskServiceOptions = {}): TaskService {
  const write = (tasks: Task[]) =>
    AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

  const read = async (): Promise<Task[]> => {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    if (raw === null) {
      await write(list);
      return list;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Stored data is corrupt");
    return parsed as Task[];
  };

  const run = async <T>(op: () => Promise<T>): Promise<T> => {
    try {
      return await op();
    } catch (e) {
      if (e instanceof TaskServiceError) throw e;
      throw new TaskServiceError("Could not access stored tasks.");
    }
  };

  return {
    list: () => run(read),
    create: (input) =>
      run(async () => {
        const task: Task = {
          ...input,
          id: newId(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        await write([task, ...(await read())]);
        return task;
      }),
    update: (id, patch) =>
      run(async () => {
        const tasks = await read();
        const existing = tasks.find((t) => t.id === id);
        if (!existing) throw new TaskServiceError("Task not found.");
        const updated = { ...existing, ...patch };
        await write(tasks.map((t) => (t.id === id ? updated : t)));
        return updated;
      }),
    remove: (id) =>
      run(async () => {
        await write((await read()).filter((t) => t.id !== id));
      }),
  };
}

export const taskService = createTaskService();
