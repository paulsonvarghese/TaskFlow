import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../theme";
import { Task, TaskInput } from "../types/task";
import { todayISO } from "../utils/date";
import { TaskFormErrors, validateTaskInput } from "../utils/validation";
import { FilterGroup } from "./FilterGroup";
import { DateField } from "./DateField";

interface Props {
  visible: boolean;
  /** When provided the form edits this task, otherwise it creates one. */
  task?: Task | null;
  onClose: () => void;
  /** Resolves true when saved; the form stays open (with an error) on false. */
  onSubmit: (input: TaskInput) => Promise<boolean>;
}

const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;

const emptyValues = (): TaskInput => ({
  title: "",
  description: "",
  priority: "medium",
  dueDate: todayISO(),
});

export function TaskFormModal({ visible, task, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<TaskInput>(emptyValues);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setValues(
      task
        ? {
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
          }
        : emptyValues()
    );
    setErrors({});
    setSubmitError(null);
  }, [visible, task]);

  const setField = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const found = validateTaskInput(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    const ok = await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      dueDate: values.dueDate.trim(),
    });
    setSubmitting(false);
    if (!ok) setSubmitError("Could not save the task. Please try again.");
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>{task ? "Edit task" : "New task"}</Text>

          <Text style={styles.label}>Title *</Text>
          <TextInput
            testID="title-input"
            style={styles.input}
            value={values.title}
            onChangeText={(v) => setField("title", v)}
            placeholder="What needs doing?"
          />
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}

          <Text style={styles.label}>Description</Text>
          <TextInput
            testID="description-input"
            style={[styles.input, styles.multiline]}
            value={values.description}
            onChangeText={(v) => setField("description", v)}
            multiline
            placeholder="Optional details"
          />
          {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}

          <Text style={styles.label}>Due date *</Text>
          <DateField
            testID="due-date-input"
            value={values.dueDate}
            onChange={(v) => setField("dueDate", v)}
          />
          {errors.dueDate && <Text style={styles.error}>{errors.dueDate}</Text>}

          <FilterGroup
            label="Priority"
            options={[...PRIORITIES]}
            value={values.priority}
            onChange={(v) => setField("priority", v)}
            testIDPrefix="form-priority"
          />

          {submitError && <Text style={styles.error}>{submitError}</Text>}

          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={[styles.button, styles.secondary]}
              testID="cancel-task"
            >
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={submitting}
              onPress={handleSubmit}
              style={[styles.button, submitting && { opacity: 0.6 }]}
              testID="submit-task"
            >
              <Text style={styles.buttonText}>
                {submitting ? "Saving…" : task ? "Save changes" : "Create task"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20, paddingTop: 56 },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: colors.text,
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  buttons: { flexDirection: "row", gap: 12, marginTop: 28 },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: { color: colors.text, fontWeight: "600" },
});
