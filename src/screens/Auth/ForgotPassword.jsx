import React from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Text, Appbar, useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";

// Define the validation schema using yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const ForgotPasswordScreen = ({ onResetPassword }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { initiatePasswordReset } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    // onResetPassword(data.email);

    try {
      await initiatePasswordReset(data.email);
      Alert.alert("Success", "Please check your email for the reset link.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Forgot Password" />
      </Appbar.Header>
      <View style={styles.container}>
        <Image
          style={styles.tinyLogo}
          source={{ uri: "https://upcareph.com/assets/logo/upcare-logo.png" }}
        />
        <Text style={[styles.title, { color: colors.primary }]}>Upcare</Text>
        <Text style={styles.description}>
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        >
          Email Password Reset Link
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    width: "100%",
  },
  errorText: {
    color: "red",
  },
  stretch: {
    width: 50,
    height: 200,
    resizeMode: "stretch",
  },
});

export default ForgotPasswordScreen;
