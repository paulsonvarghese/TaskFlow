import { Task, TaskFilters } from '../types/task';

export const DEFAULT_FILTERS: TaskFilters = { query: '', status: 'all', priority: 'all' };

export const hasActiveFilters = (f: TaskFilters): boolean =>
  f.query.trim() !== '' || f.status !== 'all' || f.priority !== 'all';

/** Pure function: title search (case-insensitive) + status + priority. */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const q = filters.query.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (q === '' || t.title.toLowerCase().includes(q)) &&
      (filters.status === 'all' || t.status === filters.status) &&
      (filters.priority === 'all' || t.priority === filters.priority),
  );
}
