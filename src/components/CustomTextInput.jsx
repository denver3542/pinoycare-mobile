import React from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput, useTheme } from "react-native-paper";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

const CustomTextInput = ({
  control,
  name,
  rules,
  styleContainer,
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
            mode="outlined"
            {...rest}
            error={!!error}
            style={[
              styles.textInput,
              {
                fontSize: 14,
                height: 30,
                paddingVertical: 10,
                backgroundColor: theme.colors.surface,
              },
            ]}
            contentStyle={styles.contentStyle}
          />
          {error && (
            <HelperText type="error" visible={!!error}>
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
};

CustomTextInput.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  styleContainer: PropTypes.object,
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
