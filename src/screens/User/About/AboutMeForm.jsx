import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from '../../../../utils/axiosConfig';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomMultilineTextInput from '../../../components/CustomMultilineTextInput';
import { useUser } from '../../../hooks/useUser';

const AboutMeScreen = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            about_me: user?.about_me || '',
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const updateAboutMe = async (dataToUpdate) => {
        try {
            setIsLoading(true);
            const user = JSON.parse(await AsyncStorage.getItem('upcare_user'));
            const headers = getJWTHeader(user);
            const { data } = await axiosInstance.put(`/user/profile/update-about`, dataToUpdate, { headers });
            const updatedUser = { ...user, ...dataToUpdate };
            queryClient.setQueryData(['user'], updatedUser);
            AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
            console.log('About Me update successful:', data);
            return data;
        } catch (error) {
            console.error('Error updating about me:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        await updateAboutMe(data);
        navigation.goBack();
    };

    return (
        <AuthenticatedLayout>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Update About" />
            </Appbar.Header>
            <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
                <View style={{ padding: 15, marginTop: 60 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#0A3480', marginBottom: 40 }}>About Me</Text>
                    <CustomMultilineTextInput control={control} name="about_me" placeholder="Tell me about yourself" />
                    <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: 40 }}>
                        Save
                    </Button>
                </View>
            </View>
            <Spinner visible={isLoading} />
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AboutMeScreen;
