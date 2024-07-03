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
  RadioButton
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
import { SocialIcon } from 'react-native-elements';

// Define validation schema
const schema = yup
  .object({
    firstname: yup.string().required("First Name is required"),
    middlename: yup.string().required("Middle Name is required"),
    lastname: yup.string().required("Last Name is required"),
    gender: yup.string().required("Gender is required"),
    date_of_birth: yup.date().required("Birthdate is required"),
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

  const { signup, googleLoginOrSignup, request } = useAuth();
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
    console.log(inputs);
    if (!agreeToTerms) {
      setError("terms", {
        type: "required",
        message: "Please agree to Terms & Conditions",
      });
      return;
    }

    try {
      const res = await signup(inputs);
      if (res.success === 0) {
        console.log(res.errors);
        const errors = res.errors;
        for (const key in errors) {
          setError(key, {
            type: "server",
            message: errors[key][0],
          });
        }
      } else {
        console.log("success");
        // showSnackbar()
      }
    } catch (err) {
      if (err.errors.length > 0) {
        setFormErrors(err.errors);
        // console.log(err.errors);
        console.log(err);
      }
      Alert.alert(err.message);
    } finally {
      // setLoading(false);
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
  const [gender, setGender] = useState(null); // State to hold selected gender
  const [visible, setVisible] = useState(false); // State to manage dropdown visibility


  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

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
          <Text style={{
            fontSize: 30,
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "bold",
            color: "red",
          }}>
            Create <Text
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
          </Text>

          <View style={{ justifyContent: "center", gap: 0 }}>
            <CustomTextInput
              control={control}
              name="firstname"
              label="First Name"
              mode="outlined"
              rules={{ required: "First Name is required" }}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <RadioButton.Group
                onValueChange={(value) => setValue('gender', value)}
                value={watcher.gender}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: Platform.OS === 'ios' ? 10 : 16, marginRight: 20 }}>Select Gender</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton.Android value="M" color={colors.primary} />
                    <Text style={{ fontSize: Platform.OS === 'ios' ? 10 : 16, marginRight: 20 }}>Male</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton.Android value="F" color={colors.primary} />
                    <Text style={{ fontSize: Platform.OS === 'ios' ? 10 : 16, marginRight: 20 }}>Female</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>


            <List.Item
              title="Birth date"
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

            <SocialIcon
              raised={true}
              // light
              title='Sign Up With Facebook'
              labelStyle={{
                fontSize: 14,
                paddingVertical: 6,
              }}
              disabled={!request}
              button
              type='facebook'
              height={50}
            />

            <SocialIcon
              raised={true}
              light
              title='Sign Up With Apple ID'
              disabled={!request}
              button
              type='apple'
              height={50}

            />

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
      <Text
        style={{ textAlign: "center", marginBottom: 10, color: colors.text }}
      >
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
  },
});

export default Signup;
