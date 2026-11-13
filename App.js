import { SafeAreaProvider } from "react-native-safe-area-context";
import { TaskListScreen } from "./src/screens/TaskListScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskListScreen />
    </SafeAreaProvider>
  );
}
