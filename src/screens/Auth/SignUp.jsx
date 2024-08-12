import React, { useState } from "react";
import { Alert, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Linking, ScrollView } from "react-native";
import {
  Button,
  Text,
  TextInput,
  useTheme,
  Checkbox,
  List,
  IconButton,
  RadioButton,
  HelperText
} from "react-native-paper";
import UnathorizeLayout from "../../Layout/User/Unauthorize/UnathorizeLayout";
import CustomTextInput from "../../components/CustomTextInput";
import { useForm } from "react-hook-form";
import CustomSelectBox from "../../components/CustomSelectBox";
import { useAuth } from "../../hooks/useAuth";
import RNPickerSelect from "react-native-picker-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { colors, SocialIcon } from 'react-native-elements';
import * as AppleAuthentication from "expo-apple-authentication";

// Define validation schema
const schema = yup
  .object({
    firstname: yup.string().required("First Name is required"),
    middlename: yup.string().required("Middle Name is required"),
    lastname: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })
  .required();


const Signup = () => {
  const navigation = useNavigation();
  const [formErrors, setFormErrors] = useState({});

  const { signup, googleLoginOrSignup, request, handleAppleSignInOrSignUp  } = useAuth();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const watcher = watch();
  const { colors } = useTheme();
  const [showPw, setShowPw] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const fontSize = Platform.OS === 'ios' ? 10 : 16;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const onSubmit = async (inputs) => {
    if (!agreeToTerms) {
      setError("terms", {
        type: "required",
        message: "Please agree to Terms & Conditions",
      });
      return;
    }

    console.log("Submitting form with inputs:", inputs);

    try {
      const res = await signup(inputs);
      console.log("Signup response:", res);

      if (!res.success) {
        console.log("Validation errors present. Handling server-side errors.");
        handleServerErrors(res.errors);
        return;
      }

      navigation.navigate('OTPVerification', { email: inputs.email });

    } catch (err) {
      console.log("Signup error:", err);
      if (err.response?.data?.errors) {
        handleServerErrors(err.response.data.errors);
      }
    }
  };

  const handleServerErrors = (errors) => {
    for (const key in errors) {
      setError(key, {
        type: "server",
        message: errors[key][0],
      });
    }
  };




  const openTermsLink = () => {
    Linking.openURL("https://example.com/terms");
  };

  const handleConfirm = (date) => {
    setValue("date_of_birth", date);
    hideDatePicker();
  };

  const handleGoogleSignIn = async () => {
    googleLoginOrSignup();
  };
  const [gender, setGender] = useState(null);
  const [visible, setVisible] = useState(false);


  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // console.log(credential);
      // Send the credential to your backend
      const response = await handleAppleSignInOrSignUp(credential);

      if (response.success) {
        // Handle successful authentication
        console.log("Login success", response);
        // Store token and user information if necessary
      } else {
        // Handle unsuccessful authentication
        setGeneralError("Apple Sign-In failed.");
      }
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // Handle that the user canceled the sign-in flow
        Alert.alert("Apple Sign-In was canceled.");
      } else {
        // Handle other errors
        console.error(e);
        Alert.alert("Apple Sign-In failed.");
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F4F7FB", }}>
      <View style={{ padding: 15, }}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 50,
            right: 20
          }}
        />
        <View style={{ marginBottom: 0, flex: 1 }}>
          {/* <Text style={{
            fontSize: 30,
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "bold",
            color: "red",
          }}>
            Create
            <Text
              style={{
                fontWeight: "bold",
                color: colors.primary,
                fontSize: 18,
                textAlign: "center",
                fontSize: 30,
              }}
            >
              Your Account
            </Text>
          </Text> */}
          <Text style={[styles.title, { color: 'red' }]}>
            Create <Text style={styles.highlight}>
              Your Account</Text>
          </Text>

          <View style={{ justifyContent: "center", gap: 0 }}>
            <CustomTextInput
              control={control}
              name="firstname"
              label="First Name"
              mode="outlined"
            //   rules={{ required: "First Name is required" }}
            />
            <CustomTextInput
              control={control}
              name="middlename"
              label="Middle Name"
              rules={{ required: "Middlename is required" }}
              mode="outlined"
            />
            <CustomTextInput
              control={control}
              name="lastname"
              label="Last Name"
              rules={{ required: "Last Name is required" }}
              mode="outlined"
            />

<View style={{ marginBottom: 10 }}>
  <RadioButton.Group
    onValueChange={(value) => setValue('gender', value)}
    value={watcher.gender}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: fontSize, marginRight: 20 }}>Select Gender (Optional)</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RadioButton.Android value="M" color={colors.primary} />
        <Text style={{ fontSize: fontSize }}>Male</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RadioButton.Android value="F" color={colors.primary} />
        <Text style={{ fontSize: fontSize }}>Female</Text>
      </View>
    </View>

  </RadioButton.Group>
</View>





<List.Item
  title="Birth date (Optional)"
  titleStyle={{ fontSize: fontSize }}
  right={(props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: fontSize }}>
        {watcher?.date_of_birth
          ? moment(watcher.date_of_birth).format('YYYY-MM-DD')
          : ''}
      </Text>
      <List.Icon {...props} icon="chevron-right" />
    </View>
  )}
  style={{
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 15,
  }}
  onPress={showDatePicker}
/>
            <CustomTextInput
              control={control}
              name="email"
              label="Email"
              mode="outlined"
              rules={{ required: "Email is required" }}
            />
            <CustomTextInput
              control={control}
              name="password"
              label="Password"
              mode="outlined"
              rules={{ required: "Password is required" }}
              secureTextEntry={!showPw}
              right={
                <TextInput.Icon
                  icon={showPw ? "eye-off" : "eye"}
                  onPress={() => setShowPw((pw) => !pw)}
                />
              }
            />
            <CustomTextInput
              control={control}
              name="confirmpassword"
              label="Confirm Password"
              mode="outlined"
              rules={{ required: "Password is required" }}
              secureTextEntry={!showPw}
              right={
                <TextInput.Icon
                  icon={showPw ? "eye-off" : "eye"}
                  onPress={() => setShowPw((pw) => !pw)}
                />
              }
            />

        <View style={styles.checkboxContainer}>
              <Checkbox.Android
                status={agreeToTerms ? "checked" : "unchecked"}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                color={colors.primary}
              />
              <Text
                onPress={openTermsLink}
                style={{ color: colors.text, marginLeft: 8 }}
              >
                I agree to Terms & Conditions
              </Text>
            </View>

            <Button
              mode="elevated"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting || isLoading}
              labelStyle={{
                fontSize: 14,
                color: 'white',
                paddingVertical: 4,
              }}
              style={{ borderRadius: 50, backgroundColor: '#0A3480', }}
            >
              Sign Up
            </Button>
            <View style={{ display: "flex", justifyContent: "center" }}>
              {errors.terms && (
                <Text style={{ color: "red", textAlign: "center" }}>
                  * {errors.terms.message}
                </Text>
              )}
            </View>


            <Text style={{ textAlign: "center", marginVertical: 20 }}>or register with</Text>
            <SocialIcon
              raised={true}
              // light
              title='Sign Up With Google'
              disabled={!request}
              button
              type='google'
              height={50}
              onPress={handleGoogleSignIn}
            />


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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={
          watcher.contact_bdate ? new Date(watcher.contact_bdate) : new Date()
        }
      />
      <Text style={{ textAlign: "center", marginBottom: 10, color: colors.text }}>
        Already have an account?{" "}
        <Text style={{ color: "#0A3480", fontWeight: 'bold' }} onPress={() => navigation.navigate("Login")}>Sign In</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 50,
    height: 50,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  highlight: {
    fontWeight: "bold",
    color: '#0A3480'
  },
});

export default Signup;
