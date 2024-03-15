import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { TextInput, Button, Card, Title, Appbar, Divider } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from '../../../../utils/axiosConfig';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomMultilineTextInput from '../../../components/CustomMultilineTextInput';
import { useUser } from '../../../hooks/useUser';
import CustomTextInput from '../../../components/CustomTextInput';
const EditEducation = () => {
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
                <Appbar.Content title="Edit Educational Background" />
            </Appbar.Header>
            <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
                <View style={{ padding: 15, marginTop: 40 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#0A3480', marginBottom: 40 }}>Educational Background</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0A3480' }}>Elementary</Text>
                    <Divider style={{ margin: 10 }}></Divider>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0A3480', marginBottom: 4 }}>School Name</Text>
                    <CustomTextInput
                        placeholder="Level of education"
                        control={control}
                        name="about_me"
                    />
                    <CustomTextInput
                        control={control}
                        placeholder="Institution name"
                        name="about_me"

                    />
                    <CustomTextInput
                        control={control}
                        placeholder="Field of study"
                        name="about_me"
                    />
                    {/* <View style={styles.dateContainer}>
                        <TextInput
                            placeholder="Start date"
                            style={styles.dateInput}
                        />
                        <TextInput
                            placeholder="End date"
                            style={styles.dateInput}
                        />
                    </View> */}
                    <CustomMultilineTextInput
                        placeholder="Description"
                        control={control}
                        name="about_me"

                    />
                    <Card.Actions>
                        <Button onPress={() => { }}>Remove</Button>
                        <Button mode="contained" onPress={() => { }}>Save</Button>
                    </Card.Actions>
                </View>

            </View>
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    // dateContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    // },
    dateInput: {
        flex: 1,
        marginHorizontal: 4,
    },
});

export default EditEducation;
