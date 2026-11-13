import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme";

export interface Filteroptions<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  label: string;
  options: Filteroptions<T>[];
  value: T;
  onChange: (value: T) => void;
  testIDPrefix: string;
}

function FilterGroupBase<T extends string>({
  label,
  options,
  value,
  onChange,
  testIDPrefix,
}: Props<T>) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            testID={`${testIDPrefix}-${o.value}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(o.value)}
            style={[styles.filter, selected && styles.filterSelected]}
          >
            <Text
              style={[styles.filterText, selected && styles.filterTextSelected]}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const FilterGroup = memo(FilterGroupBase) as typeof FilterGroupBase;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  label: { width: 64, fontSize: 12, color: colors.muted, fontWeight: "600" },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { fontSize: 13, color: colors.text },
  filterTextSelected: { color: "#fff", fontWeight: "600" },
});
