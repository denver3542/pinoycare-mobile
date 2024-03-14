import React, { useState } from 'react';
import { IconButton, Button } from 'react-native-paper';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomMultilineTextInput from '../../../components/CustomMultilineTextInput';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from '../../../../utils/axiosConfig';

async function updateAboutMe(dataToUpdate) {
    const user = JSON.parse(await AsyncStorage.getItem('upcare_user'));
    const headers = getJWTHeader(user);

    // Log the token before making the request
    console.log('Token:', headers.Authorization);

    try {
        const { data } = await axiosInstance.put(`/user/profile/update-about`, dataToUpdate, { headers });
        console.log('Update successful:', data); // Log success message
        return data;
    } catch (error) {
        console.error('Error updating about me:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};


const AboutMeScreen = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            about_me: user?.about_me || '',
        },
    });


    const { mutate, isLoading } = useMutation((dataToUpdate) => updateAboutMe(dataToUpdate), {
        onMutate: async (dataToUpdate) => {
            const getStoredUser = await AsyncStorage.getItem('upcare_user');
            const storedUser = JSON.parse(getStoredUser);
            const updatedUser = { ...storedUser, ...dataToUpdate };
            queryClient.setQueryData(['user'], updatedUser);
            AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
        },
        onSettled: () => {
            queryClient.invalidateQueries(['user']);
        },
    });

    const handlePress = {

    };
    const onSubmit = async (data) => {
        mutate(data)
        // navigation.goBack();
    };

    return (
        <AuthenticatedLayout>
            <View style={styles.container}>
                <View style={{ top: 40 }}>
                    <IconButton onPress={() => navigation.goBack()} icon="arrow-left" />
                </View>
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