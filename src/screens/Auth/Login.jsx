import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SocialIcon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  Button,
  useTheme,
  HelperText,
  IconButton,
  TextInput,
} from "react-native-paper";
import { useForm } from "react-hook-form";
import Spinner from "react-native-loading-spinner-overlay";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CustomTextInput from "../../components/CustomTextInput";
import { useAuth } from "../../hooks/useAuth";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as AppleAuthentication from "expo-apple-authentication";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
}).required();

const Login = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const {
    login,
    googleLoginOrSignup,
    facebookLoginOrSignup,
    fbRequest,
    request,
    handleAppleSignInOrSignUp,
  } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigation = useNavigation();
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
      if (!res.success) {
        if (res.message.includes("deactivated")) {
          Alert.alert("Account Deactivated", "Your account has been deactivated. Please contact support.");
        } else {
          setError("email", {
            type: "custom",
            message: "Email doesn't exist or isn't valid.",
          });
          setError("password", {
            type: "custom",
            message: "Password is incorrect.",
          });
          setGeneralError(res?.message || "Invalid username or password.");
        }
      } else {
        console.log("Login success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPw(!showPw);
  };

  const handleGoogleSignIn = async () => {
    googleLoginOrSignup();
  };

  const handleFacebookSignIn = () => {
    facebookLoginOrSignup();
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const response = await handleAppleSignInOrSignUp(credential);
      if (response.success) {
        console.log("Login success", response);
      } else {
        setGeneralError("Apple Sign-In failed.");
      }
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        Alert.alert("Apple Sign-In was canceled.");
      } else {
        console.error(e);
        Alert.alert("Apple Sign-In failed.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Spinner visible={loading} color={colors.primary} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ top: 45, right: 20, marginBottom: 50 }}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ flex: 1, top: 0 }}>
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
          />
          <CustomTextInput
            control={control}
            name="password"
            label="Password"
            secureTextEntry={!showPw}
            right={
              <TextInput.Icon
                icon={showPw ? "eye" : "eye-off"}
                onPress={togglePasswordVisibility}
              />
            }
            rules={{ required: "Password is required" }}
            mode="outlined"
            error={errors.password}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={[styles.linkText, { marginVertical: 5 }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <Button
            style={styles.button}
            labelStyle={{
              fontSize: 14,
              width: 250,
              paddingVertical: 6,
              color: "white",
            }}
            mode="elevated"
            onPress={handleSubmit(onSubmit)}
          >
            LOGIN
          </Button>
          <View>
            <Text style={{ textAlign: "center", marginVertical: 20 }}>
              or continue with
            </Text>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <SocialIcon
                raised={true}
                title="Sign In With Google"
                disabled={!request}
                button
                type="google"
                onPress={handleGoogleSignIn}
              />
              {/* <SocialIcon
                raised={true}
                title="Sign In With Facebook"
                disabled={!fbRequest}
                button
                type="facebook"
                onPress={handleFacebookSignIn}
              /> */}
              {Platform.OS === "ios" && (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  }
                  buttonStyle={
                    AppleAuthentication.AppleAuthenticationButtonStyle
                      .WHITE_OUTLINE
                  }
                  cornerRadius={20}
                  style={{ width: "100%", height: 53, marginTop: 4 }}
                  onPress={handleAppleSignIn}
                />
              )}
            </View>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpText}>
            You don't have an account yet?{" "}
            <Text style={styles.linkText}>Sign up</Text>
          </Text>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  scrollContainer: {
    flexGrow: 1,
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
  button: {
    marginTop: 8,
    borderRadius: 50,
    backgroundColor: "#0A3480",
  },
  linkText: {
    color: "#0A3480",
    textAlign: "right",
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 20,
    textAlign: "center",
  },
});

export default Login;
