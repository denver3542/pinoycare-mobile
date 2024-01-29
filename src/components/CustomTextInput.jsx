import React from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput, useTheme } from "react-native-paper";
import { Controller } from "react-hook-form";

const CustomTextInput = ({
  control,
  name,
  mode = "outlined",
  rules = {},
  styleContainer = {},
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={[styles.inputTextContainer, styleContainer]}>
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode={mode}
            {...rest}
            error={!!error}
            style={[
              styles.textInput,
              {
                fontSize: 14,
                height: 30,
                paddingVertical: 8,
              },
            ]}
            contentStyle={styles.contentStyle}
            underlineColor="transparent"
          />
          {!!error && error.message && (
            <HelperText type="error" visible={!!error}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  inputTextContainer: {
    marginBottom: 15,
  },

  contentStyle: {
    borderRadius: 10,
  },
 
});

export default CustomTextInput;
