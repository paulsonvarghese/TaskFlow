import { memo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme";
import { Task } from "../types/task";
import { formatDate, todayISO } from "../utils/date";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function TaskItemBase({ task, onToggle, onEdit, onDelete }: Props) {
  const done = task.status === "completed";
  const overdue = !done && task.dueDate < todayISO();

  return (
    <View style={styles.card} testID={`task-${task.id}`}>
      <Pressable
        testID={`toggle-${task.id}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={done ? "Mark as pending" : "Mark as completed"}
        onPress={() => onToggle(task.id)}
        style={[styles.checkbox, done && styles.checkboxDone]}
      >
        <Text style={styles.check}>{done ? "✓" : ""}</Text>
      </Pressable>

      <View style={styles.body}>
        <Text style={[styles.title, done && styles.titleDone]}>
          {task.title}
        </Text>
        {!!task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        <View style={styles.details}>
          <Text
            style={[styles.badge, { backgroundColor: colors[task.priority] }]}
          >
            {task.priority.toUpperCase()}
          </Text>
          <Text style={[styles.due, overdue && styles.overdue]}>
            {overdue ? "Overdue · " : "Due "}
            {formatDate(task.dueDate)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          testID={`edit-${task.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${task.title}`}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.action}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID={`delete-${task.id}`}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${task.title}`}
          onPress={() => onDelete(task)}
        >
          <Text style={[styles.action, { color: colors.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const TaskItem = memo(TaskItemBase);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  check: { color: "#fff", fontWeight: "700", fontSize: 14 },
  body: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: colors.text },
  titleDone: { textDecorationLine: "line-through", color: colors.muted },
  description: { fontSize: 13, color: colors.muted, marginTop: 2 },
  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  due: { fontSize: 12, color: colors.muted },
  overdue: { color: colors.danger, fontWeight: "600" },
  actions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  action: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    width: 70,
    textAlign: "center",
    borderColor: colors.border,
  },
});
