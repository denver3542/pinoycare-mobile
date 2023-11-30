import React from 'react'
import { Button, Text, useTheme } from 'react-native-paper'
import UnathorizeLayout from '../../../Layout/User/Unauthorize/UnathorizeLayout'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View } from 'react-native';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomSelectBox from '../../../components/CustomSelectBox';

export default function OrganizationEmployer() {
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, setError, setValue } = useForm();
    const { colors } = useTheme();

    const onSubmit = () => {

    }
    return (
        <UnathorizeLayout>
            <Spinner visible={loading} color={colors.primary} />
            <View style={{ paddingVertical: 20, marginBottom: 20, justifyContent: 'center', gap: 5 }}>
                <Text style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    fontSize: 18,
                    marginBottom: 30,
                    textAlign: 'center'
                }}>
                    Organizaition Account
                </Text>
                <CustomTextInput
                    control={control}
                    name="firstname"
                    placeholder="Creator Firstname"
                    rules={{ required: "Firstname must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="middlename"
                    placeholder="Creator Lastname"
                    rules={{ required: "Middlename must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="lastname"
                    placeholder="Organization Name"
                    rules={{ required: "Lastname must not be empty" }}
                />
                <CustomSelectBox
                    control={control}
                    name="Organization Type"
                    items={[
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
                    placeholder="Password"
                    rules={{ required: "Email must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="confirmpassword"
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
