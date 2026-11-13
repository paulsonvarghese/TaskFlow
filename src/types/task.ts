export type TaskStatus = "pending" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** ISO calendar date, YYYY-MM-DD */
  dueDate: string;
  createdAt: string;
}

/** Fields the user edits in the form. */
export type TaskInput = Pick<
  Task,
  "title" | "description" | "priority" | "dueDate"
>;
export type TaskPatch = Partial<TaskInput> & { status?: TaskStatus };

export interface TaskFilters {
  query: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
}
