import { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
  Text,
  Button,
  TextInput,
  useTheme,
  HelperText,
  Appbar,
  IconButton,
} from "react-native-paper";
import { useForm } from "react-hook-form";
import Spinner from "react-native-loading-spinner-overlay";
import useAuth from "../../hooks/useAuth";
import CustomTextInput from "../../components/CustomTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Define your validation schema
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
}).required();

const Login = ({ navigation }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const {
    control,
    handleSubmit,
    setError,

    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data);
      if (res.success === 0) {
        setError("email", {
          type: "custom",
          message: "Email doesn't exist or isn't valid.",
        });
        setError("password", {
          type: "custom",
          message: "Password is incorrect.",
        });
        setGeneralError(res?.message || "Invalid username or password.");
      } else {
        console.log("Login success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Spinner visible={loading} color={colors.primary} />
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 50,
          }}
        >
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          // style={{ width: 200 }}
          />
        </View>
        <View style={{ flex: 3 }}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Let's <Text style={styles.highlight}>Sign</Text> you in.
          </Text>
          {generalError && (
            <View style={{ marginBottom: 4, marginTop: -8 }}>
              <HelperText type="error" visible={generalError}>
                {generalError}
              </HelperText>
            </View>
          )}
          <CustomTextInput
            control={control}
            name="email"
            label="Email"
            rules={{ required: "Email is required" }}
            autoCapitalize="none"
            mode="outlined"
          // style={styles.input}
          />
          <CustomTextInput
            control={control}
            name="password"
            label="Password"
            secureTextEntry={!showPassword}
            rules={{ required: "Password is required" }}
            mode="outlined"
            // style={styles.input}
            error={errors.password}
            right={
              <TextInput.Icon
                name={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading || isSubmitting}
            style={styles.button}
          >
            LOGIN
          </Button>
          {/* Include other buttons like 'SIGN IN WITH GOOGLE', etc., here */}
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpText}>
              You don't have an account yet?{" "}
              <Text style={styles.linkText}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
    padding: 20,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  highlight: {
    fontWeight: "bold",
    color: "red",
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "right",
    marginBottom: 8,
  },
  signUpText: {
    marginTop: 16,
    textAlign: "center",
  },
});

export default Login;
