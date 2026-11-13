import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme";

export const LoadingState = () => (
  <View style={styles.center} testID="loading-state">
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.muted}>Loading tasks…</Text>
  </View>
);

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <View style={styles.center} testID="error-state">
    <Text style={styles.title}>Something went wrong</Text>
    <Text style={styles.muted}>{message}</Text>
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onRetry}
      style={styles.button}
      testID="retry-button"
    >
      <Text style={styles.buttonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

export const EmptyState = ({
  filtered,
  onClear,
}: {
  filtered: boolean;
  onClear: () => void;
}) => (
  <View style={styles.center} testID="empty-state">
    <Text style={styles.title}>
      {filtered ? "No matching tasks" : "No tasks yet"}
    </Text>
    <Text style={styles.muted}>
      {filtered
        ? "Try a different search or clear the filters."
        : "Tap “Add task” to create your first one."}
    </Text>
    {filtered && (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onClear}
        style={styles.button}
        testID="empty-clear-filters"
      >
        <Text style={styles.buttonText}>Clear filters</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 8,
  },
  title: { fontSize: 17, fontWeight: "700", color: colors.text },
  muted: { fontSize: 14, color: colors.muted, textAlign: "center" },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
