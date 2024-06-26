import React from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput, useTheme } from "react-native-paper";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
const CustomTextInput = ({ control, name, label, rules, styleContainer, ...rest }) => {
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View style={[styles.inputTextContainer, styleContainer]}>
          <TextInput
            label={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...rest}
            error={!!error}
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
