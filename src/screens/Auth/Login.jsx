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
import { useAuth } from "../../hooks/useAuth";
// import * as Facebook from 'expo-auth-session/providers/facebook';
// import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession from 'expo-auth-session';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

// WebBrowser.maybeCompleteAuthSession();

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

const Login = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { login, googleLoginOrSignup } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // const [requestFb, responseFb, promptAsyncFb] = Facebook.useAuthRequest({
  //   clientId: '481189014291453',
  //   customUriScheme: 'fbconnect',
  //   redirectUri: 'fbconnect://cct.com.upcare.mobile',
  //   responseType: AuthSession.ResponseType.Token,
  //   scopes: ['public_profile', 'email'],
  // });

  // useEffect(() => {
  //   if (responseFb?.type === 'success') {
  //     const { access_token } = responseFb.params;
  //     (async () => {
  //       try {
  //         const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${access_token}&fields=id,name,email,picture.type(large)`);
  //         const userData = await userResponse.json();
  //         console.log('Logged in!', userData);
  //         // navigation.navigate('NextScreen', { user: userData });
  //       } catch (error) {
  //         console.error('Error fetching user data:', error);
  //         Alert.alert('Error fetching user data');
  //       }
  //     })();
  //   } else if (responseFb?.type === 'error') {
  //     console.log('Facebook login error:', responseFb.error);
  //     Alert.alert(`Facebook Login Error: ${responseFb.error}`);
  //   }
  // }, [responseFb]);

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

  const handleFacebookSignIn = async () => {
    promptAsyncFb();
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
            Let's <Text style={styles.highlight}>Sign </Text>
            you in.
          </Text>
          {generalError && (
            <View style={{ marginBottom: 4, marginTop: -8 }}>
              <HelperText type="error" visible={!!generalError}>{generalError}</HelperText>
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
            error={!!errors.password}
          />
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={[styles.linkText, { marginVertical: 5 }]}>Forgot Password?</Text>
          </TouchableOpacity>
          <Button
            style={styles.button}
            labelStyle={{
              fontSize: 14,
              width: 250,
              paddingVertical: 6,
              color: 'white'
            }}
            mode="elevated"
            onPress={handleSubmit(onSubmit)}
          >
            LOGIN
          </Button>
          <View>
            <Text style={{ textAlign: "center", marginVertical: 20 }}>or continue with</Text>
            <View style={{ flexDirection: "column", justifyContent: "space-around" }}>
              <SocialIcon
                raised={true}
                title='Sign In With Google'
                button
                type='google'
                onPress={handleGoogleSignIn}
              />
              {/* <SocialIcon
                raised={true}
                title='Sign In With Facebook'
                disabled={!requestFb}
                button
                type='facebook'
                onPress={handleFacebookSignIn}
              /> */}
              <SocialIcon
                raised={true}
                light
                title='Sign In With Apple ID'
                button
                type='apple'
                onPress={() => console.log('Apple Pressed')}
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
    borderRadius: 50,
    backgroundColor: '#0A3480',
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
