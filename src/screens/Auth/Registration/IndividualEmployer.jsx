import React from 'react'
import { Button, Text, useTheme } from 'react-native-paper'
import UnathorizeLayout from '../../../Layout/User/Unauthorize/UnathorizeLayout'
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View } from 'react-native';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomSelectBox from '../../../components/CustomSelectBox';
import { useAuth } from '../../../hooks/useAuth';

export default function IndividualEmployer() {
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const { control, handleSubmit, watch, setError } = useForm();
    const { colors } = useTheme();


    const date_of_birth = watch('date_of_birth');

    const onSubmit = async (data) => {
        setLoading(true)
        console.log(data)
    }
    return (
        <UnathorizeLayout>
            <Spinner visible={loading} color={colors.primary} />
            <View style={{ justifyContent: 'center', gap: 5 }}>
                <Text style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    fontSize: 18,
                    marginBottom: 30,
                    textAlign: 'center'
                }}>
                    Individual Account
                </Text>
                <CustomTextInput
                    control={control}
                    name="firstname"
                    placeholder="Firstname"
                    rules={{ required: "Firstname must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="middlename"
                    placeholder="Middlename"
                    rules={{ required: "Middlename must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="lastname"
                    placeholder="Lastname"
                    rules={{ required: "Lastname must not be empty" }}
                />
                <CustomSelectBox
                    control={control}
                    name="yourFieldName"
                    items={[
                        { label: 'Select a Gender', value: '' },
                        { label: 'Male', value: 'M' },
                        { label: 'Female', value: 'F' },
                    ]}
                />
                <CustomTextInput
                    control={control}
                    name="firstname"
                    placeholder="Organization Name"
                    rules={{ required: "Firstname must not be empty" }}
                />
                <CustomSelectBox
                    control={control}
                    name="Organization Type"
                    items={[
                        { label: 'Select Organization', value: '' },
                        { label: 'Private Nurse', value: 'Private Nurse' },
                    ]}
                />
                <CustomTextInput
                    control={control}
                    name="email"
                    placeholder="Email"
                    rules={{ required: "Email must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="password"
                    type="password"
                    placeholder="Password"
                    rules={{ required: "Email must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="confirmpassword"
                    type="password"
                    placeholder="Confirm Password"
                    rules={{ required: "Email must not be empty" }}
                />
                <Button
                    style={styles.btn}
                    labelStyle={{
                        fontSize: 16, // Increase font size for larger text
                        paddingVertical: 8, // Increase padding for taller button
                    }}
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                >
                    Submit
                </Button>
            </View>
        </UnathorizeLayout>
    )
}
const styles = StyleSheet.create({
    btn: {
        marginTop: 20,
        borderRadius: 5,
    }
});