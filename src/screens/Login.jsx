import { useState, useEffect } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import {
  Button,
  Checkbox,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomTextInput from "../components/CustomTextInput";
import {
  clearStoredRememberedUser,
  getStoredRememberedUser,
  setStoredRememberedUser,
} from "../../utils";
import logo from "../../assets/icon.png";
import { useForm } from "react-hook-form";

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setError, setValue } = useForm();
  const [generalError, setGeneralError] = useState("");
  const [checked, setChecked] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { colors } = useTheme();
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    getStoredRememberedUser().then((rememberedUser) => {
      if (rememberedUser) {
        setValue("username", rememberedUser.username);
        setValue("contact_password", rememberedUser.contact_password);
        setChecked(true);
      }
    });
    setLoading(false);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
  };

  const facebookAccountHandler = async () => {
    setLoading(true);
    // await facebookLoginOrSignup();
    setLoading(false);
  };

  const googleAccountHandler = async () => {
    setLoading(true);
    // await googleLoginOrSignup();
    setLoading(false);
  };

  const navForgotPassword = async () => {
    navigation.navigate("ForgotPassword");
  };
  const navSignUp = async () => {
    navigation.navigate("SignUp");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Spinner visible={loading} color={colors.primary} />
        <View style={styles.logoContainer}>
          <Button
            mode="text"
            icon="arrow-left-thick"
            labelStyle={styles.logo}
            compact={true}
            onPress={() => navigation.goBack()}
          ></Button>
          {/* <Image source={logo} style={styles.logo} resizeMode="contain" /> */}
        </View>
        <View style={{ paddingVertical: 20, marginBottom: 20 }}>
          <Text
            variant="displayMedium"
            style={{
              fontWeight: "bold",
              color: colors.primary,
              // fontFamily: theme.fonts.ios,
            }}
          >
            Let's{" "}
            <Text
              variant="displayMedium"
              style={{ fontWeight: "bold", color: "red" }}
            >
              Sign
            </Text>{" "}
            you in.
          </Text>
        </View>
        {generalError && (
          <View style={{ marginBottom: 4, marginTop: -8 }}>
            <HelperText type="error" visible={generalError}>
              {generalError}
            </HelperText>
          </View>
        )}
        <View>
          <CustomTextInput
            control={control}
            name="username"
            label="Username/Email"
            placeholder="Enter your username or email address"
            rules={{ required: "First name must not be empty" }}
          />
          <CustomTextInput
            control={control}
            name="contact_password"
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPw}
            right={
              <TextInput.Icon
                icon={showPw ? "eye-off" : "eye"}
                onPress={() => setShowPw((pw) => !pw)}
                style={{ backgroundColor: "white" }}
              />
            }
            rules={{
              required: "Password must not be empty",
              minLength: {
                value: 3,
                message: "Password must be at least  3 characters long",
              },
            }}
          />
          <Button
            style={styles.btn}
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            icon="login"
          >
            Sign in
          </Button>
          <View style={styles.checkboxContainer}>
            <Checkbox.Android
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
            <Text variant="labelLarge" style={{ color: "#575757" }}>
              Remember me
            </Text>
          </View>
          <Button
            onPress={facebookAccountHandler}
            mode="contained"
            style={[styles.btn, { backgroundColor: "#3f5c94" }]}
            icon="facebook"
          >
            Login with Facebook
          </Button>
          <Button
            onPress={googleAccountHandler}
            mode="contained"
            style={[styles.btn, { backgroundColor: "#4286f5" }]}
            icon="google"
          >
            Login with Google
          </Button>
          {Platform.OS === "ios" ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
              }
              style={[styles.btn, { height: 40 }]}
              onPress={() => onAppleButtonPress()}
            />
          ) : (
            ""
          )}

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ marginTop: 10 }}>
              <Button
                disabled={loading}
                mode="text"
                onPress={navSignUp}
                icon="account-plus"
              >
                Sign Up
              </Button>
            </View>
            <View>
              <Button
                disabled={loading}
                mode="text"
                icon="lock-question"
                onPress={navForgotPassword}
              >
                Forgot password
              </Button>
            </View>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Text>Don't have an account? </Text>
              <Button
                style={{ textAlign: "left", color: "#008018" }}
                disabled={loading}
                variant="text"
                onPress={navSignUp}
              >
                Sign Up
              </Button>
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text
            style={{ textAlign: "center", color: colors.primary }}
            variant="bodyLarge"
          >
            Copyright {"\u00A9"} 2022
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  logo: {
    fontSize: 20,
  },
  inputText: {
    marginBottom: 8,
  },
  btn: {
    marginTop: 8,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});

export default Login;
