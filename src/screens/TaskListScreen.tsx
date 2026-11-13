import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterGroup } from "../components/FilterGroup";
import { SearchBar } from "../components/SearchBar";
import { EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import { TaskFormModal } from "../components/TaskFormModal";
import { TaskItem } from "../components/TaskItem";
import { useTaskStore } from "../store/taskStore";
import { colors } from "../theme";
import { Task, TaskInput } from "../types/task";
import { filterTasks, hasActiveFilters } from "../utils/filterTasks";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
] as const;

const PRIORITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;

export function TaskListScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const status = useTaskStore((s) => s.status);
  const error = useTaskStore((s) => s.error);
  const mutationError = useTaskStore((s) => s.mutationError);
  const filters = useTaskStore((s) => s.filters);
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const toggleStatus = useTaskStore((s) => s.toggleStatus);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const dismissError = useTaskStore((s) => s.dismissError);
  const setQuery = useTaskStore((s) => s.setQuery);
  const setStatusFilter = useTaskStore((s) => s.setStatusFilter);
  const setPriorityFilter = useTaskStore((s) => s.setPriorityFilter);
  const clearFilters = useTaskStore((s) => s.clearFilters);

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const visibleTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters]
  );
  const filtersActive = hasActiveFilters(filters);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormVisible(true);
  }, []);
  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setFormVisible(true);
  }, []);
  const closeForm = useCallback(() => setFormVisible(false), []);

  const handleSubmit = useCallback(
    async (input: TaskInput) => {
      const formOpen = editing
        ? await updateTask(editing.id, input)
        : await createTask(input);
      if (formOpen) setFormVisible(false);
      return formOpen;
    },
    [editing, createTask, updateTask]
  );

  const confirmDelete = useCallback(
    (task: Task) =>
      Alert.alert(
        "Delete task",
        `Delete “${task.title}”? This cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteTask(task.id),
          },
        ]
      ),
    [deleteTask]
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        task={item}
        onToggle={toggleStatus}
        onEdit={openEdit}
        onDelete={confirmDelete}
      />
    ),
    [toggleStatus, openEdit, confirmDelete]
  );

  const bannerMessage = mutationError ?? (tasks.length > 0 ? error : null);
  const initialLoading =
    status === "idle" || (status === "loading" && tasks.length === 0);

  let content;
  if (initialLoading) content = <LoadingState />;
  else if (status === "error" && tasks.length === 0) {
    content = (
      <ErrorState
        message={error ?? "Failed to load tasks"}
        onRetry={loadTasks}
      />
    );
  } else {
    content = (
      <FlatList
        data={visibleTasks}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={status === "loading"}
        onRefresh={loadTasks}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState filtered={filtersActive} onClear={clearFilters} />
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>TaskFlow</Text>
        <SearchBar value={filters.query} onChangeText={setQuery} />
        <FilterGroup
          label="Status"
          options={[...STATUS_OPTIONS]}
          value={filters.status}
          onChange={setStatusFilter}
          testIDPrefix="filter-status"
        />
        <FilterGroup
          label="Priority"
          options={[...PRIORITY_OPTIONS]}
          value={filters.priority}
          onChange={setPriorityFilter}
          testIDPrefix="filter-priority"
        />
        {filtersActive && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={clearFilters}
            testID="clear-filters"
            style={styles.clear}
          >
            <Text style={styles.clearText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {bannerMessage && (
        <TouchableOpacity
          onPress={dismissError}
          style={styles.banner}
          testID="error-banner"
        >
          <Text style={styles.bannerText}>
            {bannerMessage} (tap to dismiss)
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.flex}>{content}</View>

      <TouchableOpacity
        accessibilityRole="button"
        onPress={openCreate}
        style={styles.button}
        testID="add-task"
      >
        <Text style={styles.buttontext}>+ Add task</Text>
      </TouchableOpacity>

      <TaskFormModal
        visible={formVisible}
        task={editing}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginVertical: 12,
  },
  list: { padding: 16, paddingBottom: 96, flexGrow: 1 },
  clear: { alignSelf: "flex-start", marginTop: 8 },
  clearText: { color: colors.primary, fontWeight: "600" },
  banner: {
    backgroundColor: "#FFE8CC",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerText: { color: colors.danger, fontSize: 13 },
  button: {
    position: "absolute",
    right: 16,
    bottom: 100,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
  },
  buttontext: { color: "#fff", fontWeight: "700" },
});
