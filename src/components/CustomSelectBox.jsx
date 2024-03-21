import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, useTheme } from "react-native-paper";
import { Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";

const CustomSelectBox = ({
  control,
  name,
  mode = "outlined",
  rules = {},
  styleContainer = {},
  items,
  ...rest
}) => {
  const theme = useTheme(); // Access the theme
  const [isFocused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View>
          <View
            style={[
              theme.roundness,
              styles.inputContainer,
              styleContainer,
              error && styles.errorContainer,
              {
                borderColor: isFocused
                  ? theme.colors.primary // Border color when focused
                  : error
                  ? theme.colors.error
                  : theme.colors.primary, // Border color when not focused and no error
                borderWidth: isFocused || error ? 2 : 1, // Border width based on focus and error state
              },
            ]}
          >
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
              onFocus={() => setFocused(true)}
              style={{ fontSize: 14 }}
              {...rest}
            >
              {items.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                  mode={mode}
                />
              ))}
            </Picker>
          </View>
          {!!error && error.message && (
            <HelperText
              type="error"
              visible={!!error}
              style={{ color: theme.colors.error }}
            >
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
};

export default CustomSelectBox;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
    backgroundColor: "white",
    height: 50,
    borderRadius: 4,
    overflow: "hidden",
  },
  errorContainer: {
    borderColor: "red",
  },
});
