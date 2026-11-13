import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import {
  formatDate,
  fromISODate,
  isValidISODate,
  toISODate,
} from "../utils/date";

interface Props {
  /** ISO date, YYYY-MM-DD */
  value: string;
  onChange: (iso: string) => void;
  testID?: string;
}

export function DateField({ value, onChange, testID }: Props) {
  const [open, setOpen] = useState(false);
  const date = isValidISODate(value) ? fromISODate(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android shows a dialog that closes itself; iOS stays inline until "Done".
    if (Platform.OS === "android") setOpen(false);
    if (event.type === "set" && selected) onChange(toISODate(selected));
  };

  return (
    <View>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel="Due date"
        onPress={() => setOpen((o) => !o)}
        style={styles.field}
      >
        <Text style={styles.text}>{formatDate(value)}</Text>
      </Pressable>
      {open && (
        <DateTimePicker
          testID="date-picker"
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleChange}
        />
      )}
      {open && Platform.OS === "ios" && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(false)}
          style={styles.done}
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
  },
  text: { fontSize: 15, color: colors.text },
  done: { alignSelf: "flex-end", paddingVertical: 8 },
  doneText: { color: colors.primary, fontWeight: "600" },
});
