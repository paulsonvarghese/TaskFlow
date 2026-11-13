import { TaskInput } from '../types/task';
import { isValidISODate } from './date';

export type TaskFormErrors = Partial<Record<'title' | 'description' | 'dueDate', string>>;

export const TITLE_MAX = 80;
export const DESCRIPTION_MAX = 500;

export function validateTaskInput(values: TaskInput): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Title is required';
  else if (title.length > TITLE_MAX) errors.title = `Title must be ${TITLE_MAX} characters or fewer`;
  if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer`;
  }
  if (!values.dueDate.trim()) errors.dueDate = 'Due date is required';
  else if (!isValidISODate(values.dueDate.trim())) errors.dueDate = 'Use a valid date: YYYY-MM-DD';
  return errors;
}
