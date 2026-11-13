import { memo } from "react";
import { StyleSheet, TextInput } from "react-native";
import { colors } from "../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

function SearchBarBase({ value, onChangeText }: Props) {
  return (
    <TextInput
      testID="search-input"
      accessibilityLabel="Search tasks by title"
      placeholder="Search by title…"
      placeholderTextColor={colors.muted}
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      clearButtonMode="while-editing"
      style={styles.input}
    />
  );
}

export const SearchBar = memo(SearchBarBase);

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
});
