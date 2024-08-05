import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

const OTPVerification = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params;
    const { control, handleSubmit, setError } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { verifyOtp, resendOtp } = useAuth();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await verifyOtp(data.otp_code);
            if (response.success) {
                Alert.alert('Success', 'OTP verified successfully');
            } else {
                setError('otp_code', {
                    type: 'manual',
                    message: response.message
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to verify OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        try {
            const response = await resendOtp(email);
            if (response.success) {
                Alert.alert('Success', 'OTP resent successfully');
            } else {
                Alert.alert('Message', response.message);
            }
        } catch (error) {
            console.error('Failed to resend OTP:', error);
            Alert.alert('Error', 'Failed to resend OTP');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header mode="small" style={{ backgroundColor: "#0A3480"}} >
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="OTP Verification" color='white' />
            </Appbar.Header>

            <View style={styles.innerContainer}>
                <Text style={styles.instructions}>
                    Enter the OTP sent to {email}
                </Text>
                <Controller
                    control={control}
                    name="otp_code"
                    rules={{ required: 'OTP is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                            <TextInput
                                label="OTP"
                                mode="outlined"
                                value={value}
                                onChangeText={onChange}
                                error={!!error}
                                style={styles.input}
                            />
                            {error && <Text style={styles.errorText}>{error.message}</Text>}
                        </>
                    )}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                    style={styles.button}
                >
                    Verify OTP
                </Button>
                <Button
                    mode="text"
                    onPress={handleResendOtp}
                    loading={isResending}
                    style={styles.button}
                >
                    Resend OTP
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },
    innerContainer: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    instructions: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default OTPVerification;
