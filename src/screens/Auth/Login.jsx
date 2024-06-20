import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert // Import Alert from React Native
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
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  androidClientId: '1052234263699-85n1ot28d05svoo6k9em0dm89ut2abi3.apps.googleusercontent.com',
  iosClientId: '1052234263699-60th2744n696g8md6pid4ocoqj8irvgd.apps.googleusercontent.com',
  expoClientId: '1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com',
  webClientId: '1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com',
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

const Login = () => {
  const [userinfo, setUserInfo] = useState(null);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigation = useNavigation();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: config.androidClientId,
    iosClientId: config.iosClientId,
    expoClientId: config.expoClientId,
    clientId: config.webClientId,
    redirectUri: 'com.upcare.mobile:/oauthredirect',
  });

  useEffect(() => {
    handleSignWithGoogle();
  }, [response]);

  async function handleSignWithGoogle() {
    const user = await AsyncStorage.getItem('upcare_user');
    if (!user) {
      if (response?.type === "success") {
        await getGoogleUser(response.authentication.idToken);
      } else if (response?.type === "error") {
        // Alert.alert("Google Sign-In Error", "Failed to sign in with Google. Please try again.");
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getGoogleUser(authentication?.idToken);
    }
  }, [response]);

  const getGoogleUser = async (idToken) => {
    if (!idToken) {
      // Alert if idToken is missing
      // Alert.alert("Token Error", "Failed to receive Google token. Please try again.");
      return;
    }

    try {
      const response = await fetch('https://phplaravel-719501-3973159.cloudwaysapps.com/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to authenticate with Google: ${errorMessage}`);
        // Alert.alert("Google Authentication Error", `Failed to authenticate with Google: ${error.message}`);
      }

      const data = await response.json();
      await AsyncStorage.setItem('upcare_user', JSON.stringify(data));
      setUserInfo(data);

      // Display token in alert upon successful authentication
      // Alert.alert("Token Received", `Token: ${idToken}`);
    } catch (error) {
      console.error('Error fetching Google user:', error);
      setGeneralError('Failed to authenticate with Google');
      // Alert.alert("Google Authentication Error", `Failed to authenticate with Google: ${error.message}`);
    }
  };

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
                onPress={togglePasswordVisibility}
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
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading || isSubmitting}
            style={styles.button}
          >
            LOGIN
          </Button>
          <View>
            <Text style={{ textAlign: "center", marginVertical: 20 }}>or continue with</Text>
            <View style={{ flexDirection: "column", justifyContent: "space-around" }}>
              <SocialIcon
                raised={false}
                light
                title='Sign In With Google'
                disabled={!request}
                button
                type='google'
                onPress={() => promptAsync({ useProxy: Platform.OS === 'ios' })}
              />
              <SocialIcon
                raised={false}
                light
                title='Sign In With Facebook'
                button
                type='facebook'
                onPress={handleFacebookSignIn}
              />
              <SocialIcon
                raised={false}
                light
                title='Sign In With Apple ID'
                button
                type='apple'
                onPress={handleAppleSignIn}
              />
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
  button: {
    marginTop: 8,
    paddingVertical: 3,
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
