import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, useTheme } from "react-native-paper";
import { Controller } from "react-hook-form";
import RNPickerSelect from "react-native-picker-select";

const CustomSelectBox = ({
  control,
  name,
  mode = "outlined",
  rules = {},
  styleContainer = {},
  items,
  ...rest
}) => {
  const theme = useTheme();
  const [isFocused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View>
          <View
            style={[
              theme.roundness,
              styles.inputContainer,
              styleContainer,
              error && styles.errorContainer,
              {
                borderColor: isFocused
                  ? theme.colors.primary
                  : error
                    ? theme.colors.error
                    : theme.colors.primary,
                borderWidth: isFocused || error ? 2 : 1,
              },
            ]}
          >
            <RNPickerSelect
              value={value}
              onValueChange={onChange}
              onOpen={() => setFocused(true)}
              onClose={() => setFocused(false)}
              items={items}
              style={{
                inputIOS: {
                  fontSize: 14,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                },
                inputAndroid: {
                  fontSize: 14,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                },
              }}
              {...rest}
            />
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

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
    backgroundColor: "white",
    height: 50,
    borderRadius: 4,
    overflow: "hidden",
  },
  errorContainer: {
    borderColor: "red",
  },
});

export default CustomSelectBox;
