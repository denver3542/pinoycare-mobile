import React, { useState } from "react";
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Linking,
} from "react-native";
import {
  Button,
  Text,
  TextInput,
  useTheme,
  Checkbox,
} from "react-native-paper";
import UnathorizeLayout from "../../Layout/User/Unauthorize/UnathorizeLayout";
import CustomTextInput from "../../components/CustomTextInput";
import { useForm } from "react-hook-form";
import CustomSelectBox from "../../components/CustomSelectBox";
import useAuth from "../../hooks/useAuth";
import CustomSnackbar from "../../components/CustomSnackbar";

const Signup = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { control, handleSubmit, watch, setError } = useForm();
  const { colors } = useTheme();
  const [showPw, setShowPw] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const showSnackbar = () => {
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  const onSubmit = async (data) => {
    if (!agreeToTerms) {
      setError('terms', { type: 'required', message: 'Please agree to Terms & Conditions' });
      return;
    }

    setLoading(true);
    try {
      const res = await signup(data);
      if (res.success === 0) {
        setError('email', { type: 'custom', message: 'Email is already taken.' });
      } else {
        console.log('success');
        // showSnackbar()
      }
    } catch (err) {
      setError('email', { type: 'custom', message: 'Email is already taken.' });
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const openTermsLink = () => {
    Linking.openURL('https://example.com/terms');
  };

  return (
    <UnathorizeLayout>
      <View style={{ justifyContent: 'center', gap: 5 }}>


        <Text style={{
          fontWeight: "bold",
          color: colors.primary,
          fontSize: 18,
          marginBottom: 30,
          textAlign: 'center'
        }}>
          Professional Account
        </Text>
        <CustomTextInput
          control={control}
          name="firstname"
          placeholder="First Name"
          rules={{ required: "First Name is required" }}
        />
        <CustomTextInput
          control={control}
          name="middlename"
          placeholder="Middle Name"
          rules={{ required: "Middlename is required" }}
        />
        <CustomTextInput
          control={control}
          name="lastname"
          placeholder="Last Name"
          rules={{ required: "Last Name is required" }}
        />
        <CustomSelectBox
          control={control}
          name="gender"
          items={[
            { label: 'Select a Gender', value: '' },
            { label: 'Male', value: 'M' },
            { label: 'Female', value: 'F' },
          ]}
          rules={{ required: "Gender is required" }}
        />
        <CustomTextInput
          control={control}
          name="date_of_birth"
          placeholder="Birthdate"
          rules={{ required: "Birthdate is required" }}
        />
        <CustomTextInput
          control={control}
          name="email"
          placeholder="Email"
          rules={{ required: "Email is required" }}
        />
        <CustomTextInput
          control={control}
          name="password"
          placeholder="Password"
          rules={{ required: "Password is required" }}
          secureTextEntry={!showPw}
          right={<TextInput.Icon icon={showPw ? "eye-off" : "eye"} onPress={() => setShowPw(pw => !pw)} />}
        />
        <CustomTextInput
          control={control}
          name="confirmpassword"
          placeholder="Confirm Password"
          rules={{ required: "Password is required" }}
          secureTextEntry={!showPw}
          right={<TextInput.Icon icon={showPw ? "eye-off" : "eye"} onPress={() => setShowPw(pw => !pw)} />}
        />

        <Button
          style={styles.btn}
          labelStyle={{
            fontSize: 16,
            paddingVertical: 6,
          }}
          mode="contained"
          icon="login"
          onPress={handleSubmit(onSubmit)}
        >
          Sign Up
        </Button>
        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            status={agreeToTerms ? 'checked' : 'unchecked'}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            color={colors.primary}

          />
          <Text onPress={openTermsLink} style={{ color: colors.text, marginLeft: 8 }}>
            I agree to Terms & Conditions
          </Text>
        </View>



        <Text style={{ textAlign: 'center', marginBottom: 20, color: colors.text }}>
          Already have an account?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: 'red' }}>Sign In</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </UnathorizeLayout>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 50,
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Signup;
