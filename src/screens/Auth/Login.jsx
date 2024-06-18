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

// Remove this line as it's not needed in this context
// import * as WebBrowser from 'expo-web-browser';

// WebBrowser.maybeCompleteAuthSession(); // Remove this line as well

const config = {
  androidClientId: '1052234263699-85n1ot28d05svoo6k9em0dm89ut2abi3.apps.googleusercontent.com',
  iosClientId: '1052234263699-60th2744n696g8md6pid4ocoqj8irvgd.apps.googleusercontent.com',
  expoClientId: '1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com',
  redirectUri: 'com.upcare.mobile:/oauthredirect'
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

const Login = () => {
  const [userinfo, setUserInfo] = useState(null); // Corrected useState declaration
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigation = useNavigation();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.androidClientId,
    iosClientId: config.iosClientId,
    expoClientId: config.expoClientId,
    redirectUri: config.redirectUri,
    selectAccount: true,
  });

  useEffect(() => {
    handleSignWithGoogle();
  }, [response]);

  async function handleSignWithGoogle() {
    const user = await AsyncStorage.getItem('upcare_user');
    if (!user) {
      if (response?.type === "success") {
        await getGoogleUser(response.authentication.accessToken);
        // Alert.alert('Google Sign-In', 'You have successfully signed in with Google.');
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getGoogleUser(authentication?.accessToken);
    }
  }, [response]);

  const getGoogleUser = async (accessToken) => {
    if (!accessToken) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const user = await response.json();
      await AsyncStorage.setItem('upcare_user', JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error('Error fetching Google user:', error);
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
              <SocialIcon raised={false} light title='Sign In With Google' disabled={!request} button type='google' onPress={() => promptAsync({ useProxy: Platform.OS === 'ios' })} />
              <SocialIcon raised={false} light title='Sign In With Facebook' button type='facebook' onPress={handleFacebookSignIn} />
              <SocialIcon raised={false} light title='Sign In With Apple ID' button type='apple' onPress={handleAppleSignIn} />
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
