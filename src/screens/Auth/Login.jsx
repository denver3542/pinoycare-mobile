import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { SocialIcon } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  Button,
  useTheme,
  HelperText,
  IconButton,
  TextInput
} from "react-native-paper";
import { useForm } from "react-hook-form";
import Spinner from "react-native-loading-spinner-overlay";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CustomTextInput from "../../components/CustomTextInput";
import useAuth from "../../hooks/useAuth";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

const Login = () => {
  const [userinfo, setUserInfo] = useState(null);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { login, promptAsync } = useAuth();
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
      if (res.success === 0) {
        setError("email", { type: "custom", message: "Email doesn't exist or isn't valid." });
        setError("password", { type: "custom", message: "Password is incorrect." });
        setGeneralError(res?.message || "Invalid username or password.");
      } else {
        console.log("Login success");
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPw(!showPw);
  };

  const handleFacebookSignIn = () => {
    console.log('Facebook Pressed');
  };

  const handleAppleSignIn = () => {
    console.log('Apple Pressed');
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
        {/* {userinfo && (
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <Text>User Information:</Text>
            <Text>Email: {userinfo.email}</Text>
          </View>
        )} */}
        <View style={{ flex: 1, top: 0 }}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Let's <Text style={styles.highlight}>Sign</Text> you in.
          </Text>
          {generalError && (
            <View style={{ marginBottom: 4, marginTop: -8 }}>
              <HelperText type="error" visible={generalError}>{generalError}</HelperText>
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
                onPress={() => setShowPw((pw) => !pw)}
              />
            }
            rules={{ required: "Password is required" }}
            mode="outlined"
            error={errors.password}
          />
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={[styles.linkText, { marginVertical: 5 }]}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button
            mode="elevated"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            contentStyle={{ backgroundColor: '#0A3480' }}
            labelStyle={{
              width: 250,
              height: "auto",
              fontSize: 14,
              paddingVertical: 6,
              color: 'white'
            }}
          // loading={isLoading || isSubmitting}
          >
            LOGIN
          </Button>
          <View>
            <Text style={{ textAlign: "center", marginVertical: 20 }}>or continue with</Text>
            <View style={{ flexDirection: "column", justifyContent: "space-around" }}>
              <SocialIcon raised={true} light title='Sign In With Google' button type='google' onPress={() => promptAsync({ useProxy: Platform.OS === 'ios' })} />
              <SocialIcon raised={true} light title='Sign In With Facebook' button type='facebook' onPress={handleFacebookSignIn} />
              <SocialIcon raised={true} light title='Sign In With Apple ID' button type='apple' onPress={handleAppleSignIn} />
            </View>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpText}>
            You don't have an account yet? <Text style={styles.linkText}>Sign up</Text>
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
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    // paddingVertical: 3,
    borderRadius: 50,
  },
  linkText: {
    color: "#0A3480",
    textAlign: "right",
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    textAlign: "center",
  },
});

export default Login;
