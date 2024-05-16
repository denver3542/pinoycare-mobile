import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Linking } from "react-native";
import {
  Button,
  Text,
  TextInput,
  useTheme,
  Checkbox,
  List,
  IconButton,
} from "react-native-paper";
import UnathorizeLayout from "../../Layout/User/Unauthorize/UnathorizeLayout";
import CustomTextInput from "../../components/CustomTextInput";
import { useForm } from "react-hook-form";
import CustomSelectBox from "../../components/CustomSelectBox";
import useAuth from "../../hooks/useAuth";
import RNPickerSelect from "react-native-picker-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

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

  const { signup } = useAuth();
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

  return (
    <UnathorizeLayout>
      <IconButton
        icon="arrow-left"
        onPress={() => navigation.goBack()}
      />
      <View style={{ marginTop: 50 }}>
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
          {/* Here is the selection of gender */}
          <View style={{ width: "100%", marginBottom: 15 }}>
            <RNPickerSelect
              onValueChange={(value) => setValue("gender", value)}
              items={[
                { label: "Male", value: "M" },
                { label: "Female", value: "F" },
                { label: "Other", value: "Other" },
              ]}
              style={{
                inputAndroid: {
                  color: colors.text,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "gray",
                  borderRadius: 5,
                  paddingRight: 30,
                  backgroundColor: "#FFFFFF",
                },
                inputIOS: {
                  color: colors.text,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  borderWidth: 1,
                  borderColor: errors.gender ? "red" : "gray",
                  borderRadius: 5,
                  paddingRight: 30,
                  backgroundColor: "#FFFFFF",
                },
              }}
              placeholder={{ label: "Select your gender", value: null }}
            />
            {errors.gender && (
              <Text style={{ color: "red" }}>{errors.gender.message}</Text>
            )}
          </View>
          <List.Item
            title="Birth date"
            right={(props) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>
                  {watcher?.date_of_birth
                    ? moment(watcher.date_of_birth).format("YYYY-MM-DD")
                    : ""}
                </Text>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "gray",
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
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting || isLoading}
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

          <Text
            style={{ textAlign: "center", marginBottom: 20, color: colors.text }}
          >
            Already have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "red" }}>Sign In</Text>
            </TouchableOpacity>
          </Text>
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
    </UnathorizeLayout>
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
