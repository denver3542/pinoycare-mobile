import { useState, useEffect } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
// import {
//   clearStoredRememberedUser,
//   getStoredRememberedUser,
//   setStoredRememberedUser,
// } from "../../utils";
import { useForm } from "react-hook-form";
import CustomTextInput from "../../components/CustomTextInput";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UnathorizeLayout from "../../Layout/User/Unauthorize/UnathorizeLayout";
import useAuth from "../../hooks/useAuth";

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { control, handleSubmit, setError, setValue } = useForm();
  const [showPw, setShowPw] = useState(false);
  const { colors } = useTheme();

  const onSubmit = async (data) => {
    setLoading(true)
    login(data).then((res) => {
      if (res.success === 0) {
        setError('email', { type: 'custom', message: 'Your email is existing or not valid.' })
        setError('password', { type: 'custom', message: 'Your password must be incorrect.' })
      } else {
        console.log('success');
        // showSnackbar()
      }
    }).catch(err => {
      setError('email', { type: 'custom', message: 'Your email is existing or not valid.' })
      setError('password', { type: 'custom', message: 'Your password must be incorrect.' })
      console.log(err);
    });
    setLoading(false)
  };

  const navForgotPassword = async () => {
    navigation.navigate("ForgotPassword");
  };
  const navSignUp = async () => {
    navigation.navigate("SignUp");
  };
  return (
    <UnathorizeLayout>
      <Spinner visible={loading} color={colors.primary} />
      <View style={{ paddingVertical: 20, marginBottom: 20, alignItems: 'center' }}>
        <Text style={{
          fontWeight: "bold",
          color: colors.primary,
          fontSize: 24
        }}
        >
          Let's{" "}
          <Text style={{ fontWeight: "bold", color: "red", fontSize: 24 }}
          >
            Sign
          </Text>{" "}
          you in.
        </Text>
      </View>

      <View >
        <CustomTextInput
          control={control}
          name="email"
          placeholder="Email"
          rules={{ required: "Email is required" }}
        // rules={{ required: "Email must not be empty" }}
        />
        <CustomTextInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry={!showPw}
          rules={{ required: "Password is required" }}
          right={
            <TextInput.Icon
              icon={showPw ? "eye-off" : "eye"}
              onPress={() => setShowPw((pw) => !pw)}
              style={{ backgroundColor: "transparent" }}
            />
          }
        />
        <View style={styles.checkboxContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", }}>
            {/* <Checkbox.Android
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
              <Text variant="labelLarge" style={{ color: "#575757" }}>
                Remember me
              </Text> */}
          </View>

          <Button
            disabled={loading}
            mode="text"
            icon="lock-question"
            onPress={navForgotPassword}
          >
            Forgot password
          </Button>
        </View>

        <Button
          style={styles.btn}
          labelStyle={{
            fontSize: 14, // Increase font size for larger text
            paddingVertical: 6, // Increase padding for taller button
          }}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          icon="login"
        >
          Sign in
        </Button>

        {Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
          style={[styles.btn, { height: 40 }]}
          onPress={onAppleButtonPress}
        />
      )}
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <View>
            <Text style={styles.lineText}>or</Text>
          </View>
          <View style={styles.line} />
        </View>

        <Button
          style={{
            textAlign: "left", color: "#008018", borderColor: '#012970',
            borderWidth: 1,
            borderRadius: 50,
            marginBottom: 30,

          }}
          labelStyle={{
            fontSize: 14, // Increase font size for larger text
            paddingVertical: 6, // Increase padding for taller button
          }}
          disabled={loading}
          onPress={navSignUp}
          icon="account-plus"
        >
          Sign Up
        </Button>
      </View>
    </UnathorizeLayout>


  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  lineContainer: {
    flexDirection: 'row', // Align children in a row
    alignItems: 'center', // Center items vertically
    marginVertical: 20, // Add vertical spacing
  },
  line: {
    flex: 1, // Take up all available space
    height: 1, // 1 pixel high line
    backgroundColor: 'grey', // Line color
  },
  lineText: {
    width: 50, // Width of the 'or' container
    textAlign: 'center', // Center text horizontally
    color: 'grey', // Text color
    paddingHorizontal: 10, // Horizontal padding
  },
});

export default Login;
