import { fireEvent, render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TaskListScreen } from "../screens/TaskListScreen";
import { useTaskStore } from "../store/taskStore";
import { Task } from "../types/task";
import { DEFAULT_FILTERS } from "../utils/filterTasks";

const make = (
  id: string,
  title: string,
  status: Task["status"],
  priority: Task["priority"]
): Task => ({
  id,
  title,
  description: `${title} details`,
  status,
  priority,
  dueDate: "2026-12-01",
  createdAt: "2026-11-01T00:00:00.000Z",
});

const fixtures = [
  make("1", "Buy groceries", "pending", "low"),
  make("2", "Review PRs", "completed", "high"),
];

const renderScreen = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 360, height: 800 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <TaskListScreen />
    </SafeAreaProvider>
  );

beforeEach(() => {
  useTaskStore.setState({
    tasks: fixtures,
    status: "ready",
    error: null,
    mutationError: null,
    filters: DEFAULT_FILTERS,
    loadTasks: jest.fn().mockResolvedValue(undefined),
  });
});

describe("TaskListScreen", () => {
  it("renders the task list", () => {
    renderScreen();
    expect(screen.getByText("Buy groceries")).toBeTruthy();
    expect(screen.getByText("Review PRs")).toBeTruthy();
  });

  it("filters by search text and lets the user clear it", () => {
    renderScreen();
    fireEvent.changeText(screen.getByTestId("search-input"), "groc");
    expect(screen.getByText("Buy groceries")).toBeTruthy();
    expect(screen.queryByText("Review PRs")).toBeNull();

    fireEvent.press(screen.getByTestId("clear-filters"));
    expect(screen.getByText("Review PRs")).toBeTruthy();
  });

  it("filters by status and priority", () => {
    renderScreen();
    fireEvent.press(screen.getByTestId("filter-status-completed"));
    expect(screen.queryByText("Buy groceries")).toBeNull();
    fireEvent.press(screen.getByTestId("filter-priority-low"));
    expect(screen.getByText("No matching tasks")).toBeTruthy();
  });

  it("shows the empty state when there are no tasks", () => {
    useTaskStore.setState({ tasks: [] });
    renderScreen();
    expect(screen.getByText("No tasks yet")).toBeTruthy();
  });

  it("shows the error state with a working retry", () => {
    const loadTasks = jest.fn().mockResolvedValue(undefined);
    useTaskStore.setState({
      tasks: [],
      status: "error",
      error: "Network request failed.",
      loadTasks,
    });
    renderScreen();
    expect(screen.getByText("Network request failed.")).toBeTruthy();
    loadTasks.mockClear();
    fireEvent.press(screen.getByTestId("retry-button"));
    expect(loadTasks).toHaveBeenCalledTimes(1);
  });

  it("toggles a task status from the list", () => {
    useTaskStore.setState({ toggleStatus: jest.fn().mockResolvedValue(true) });
    renderScreen();
    fireEvent.press(screen.getByTestId("toggle-1"));
    expect(useTaskStore.getState().toggleStatus).toHaveBeenCalledWith("1");
  });
});
