import { StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";

const CustomTextInput = ({
  control,
  name,
  mode = "outlined",
  rules = {},
  styleContainer = {},
  styleTextInput = {},
  ...rest
}) => (
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
          style={styleTextInput}
          contentStyle={styles.contentStyle}
          underlineStyle={styles.underlineStyle}
          outlineStyle={styles.outlineStyle}
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

export default CustomTextInput;

const styles = StyleSheet.create({
  inputTextContainer: {
    marginBottom: 10,
  },
  contentStyle: {
    borderRadius: 10,
  },
  underlineStyle: {
    display: "none",
  },
  outlineStyle: {
    borderWidth: 0,
  },
});
