import { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { SocialIcon } from 'react-native-elements';
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  Button,
  TextInput,
  useTheme,
  HelperText,
  Appbar,
  IconButton,
  TouchableRipple,
} from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import Spinner from "react-native-loading-spinner-overlay";
import useAuth from "../../hooks/useAuth";
import CustomTextInput from "../../components/CustomTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";

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
  const handleGoogleSignIn = () => {
    console.log('Google Pressed')
  };

  const handleFacebookSignIn = () => {
    console.log('Facebook Pressed')
  };

  const handleAppleSignIn = () => {
    console.log('Apple Pressed')
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Spinner visible={loading} color={colors.primary} />
        <View
          style={{
            display: "flex",
            justifyContent: "flex-start",
            bottom: 5,
            top: 20
          }}
        >
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={{ flex: 1, marginVertical: 100 }}>
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
            secureTextEntry={!showPassword}
            toggleSecureTextEntry={togglePasswordVisibility}
            rules={{ required: "Password is required" }}
            mode="outlined"
            error={errors.password}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
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

          {/* Additional sign-up options */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ textAlign: "center", marginVertical: 20 }}>or continue with</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <SocialIcon
                light
                type='google'
                onPress={handleGoogleSignIn}
              />
              <SocialIcon
                light
                type='facebook'
                onPress={handleFacebookSignIn}
              />
              <SocialIcon
                light
                type='apple'
                onPress={handleAppleSignIn}
              />
            </View>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpText}>
              You don't have an account yet?{" "}
              <Text style={styles.linkText}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
    padding: 20,
    backgroundColor: "#F4F7FB",
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
    borderRadius: 50
  },
  linkText: {
    color: "#0A3480",
    // textDecorationLine: "underline",
    textAlign: "right",
    fontWeight: 'bold'
    // marginBottom: 8,
  },
  signUpText: {
    marginTop: 50,
    textAlign: "center",
  },
  icons: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 0.2,
      },
    }),
  },
});

export default Login;
