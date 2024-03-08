import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import CustomTextInput from '../../../components/CustomTextInput';
import { useForm } from "react-hook-form";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";
import { useUser } from "../../../hooks/useUser";
import { useQueryClient, useMutation } from '@tanstack/react-query';

const defaultProfileImage = require('../../../../assets/images/default-men.png');

async function updateProfile(userId) {
    try {
        const user = await AsyncStorage.getItem('upcare_user');
        const headers = getJWTHeader(user);
        const response = await axiosInstance.put(`/user/profile/update/${userId}`, { headers });
        return response.data.user;
    } catch (error) {
        throw new Error(error.response.data.message || 'Something went wrong');
    }
}


const EditUserProfile = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const { control, handleSubmit, setValue, watch, formState: { isDirty } } = useForm({
        defaultValues: {
            "firstname": user?.firstname || '',
            "middlename": user?.middlename || '',
            "lastname": user?.lastname || '',
            "phone": user?.phone || '',
            "email": user?.email || '',
            "permanent_address": user?.permanent_address || '',
            "current_address": user?.current_address || '',
        }
    });

    const { mutate, isLoading } = useMutation((updateData) => updateProfile(user?.id, updateData), {
        onSuccess: (data, variables, context) => {
            const updatedUser = { ...user, ...variables };
            queryClient.setQueryData(["user"], updatedUser);
            AsyncStorage.setItem("upcare_user", JSON.stringify(updatedUser));
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    });

    const navigation = useNavigation();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true) {
            return;
        }


        if (pickerResult.assets.length > 0) {
            const selectedImage = pickerResult.assets[0];
            setProfileImage({ uri: selectedImage.uri });
        }
    };


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const selectedDate = new Date(date);
        const dateToStore = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`
        setValue('date_of_birth', dateToStore);
        setDatePickerVisibility(false);
    };

    const handleSaveChanges = (data) => {
        if (user) {
            mutate(data);
        } else {
            console.error('User data is null');
        }
    };


    // Watching changes to specific form fields
    const firstNameValue = watch('firstname');
    const middlenameValue = watch('middlename');
    const lastNameValue = watch('lastname');
    const emailValue = watch('email');
    const phoneValue = watch('phone');
    const permanentAddressValue = watch('permanent_address');
    const currentAddressValue = watch('current_address');

    useEffect(() => {
        console.log('First Name:', firstNameValue);
        console.log('Last Name:', lastNameValue);
        console.log('Email:', emailValue);
    }, [firstNameValue, middlenameValue, lastNameValue, emailValue, phoneValue, permanentAddressValue, currentAddressValue]);


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <ScrollView>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, top: 30 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FontAwesome5 name="arrow-left" size={20} color="white" solid style={styles.backIcon} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Edit Profile</Text>
                        <TouchableOpacity onPress={handleSubmit(handleSaveChanges)}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileImageContainer}>
                        <TouchableOpacity onPress={selectImage}>
                            <Image
                                source={profileImage}
                                style={styles.profileImage}
                            />
                            <View style={styles.cameraIconContainer}>
                                <FontAwesome5 name="camera" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ padding: 15, marginTop: 60 }}>
                    <CustomTextInput
                        control={control}
                        name="firstname"

                    />

                    <CustomTextInput
                        control={control}
                        name="middlename"

                    />

                    <CustomTextInput
                        control={control}
                        name="lastname"

                    />

                    <CustomTextInput
                        control={control}
                        name="phone"

                    />

                    <CustomTextInput
                        control={control}
                        name="email"

                    />

                    <CustomTextInput
                        control={control}
                        name="permanent_address"

                    />

                    <CustomTextInput
                        control={control}
                        name="current_address"

                    />

                    {/* <TouchableOpacity onPress={showDatePicker}>
        <CustomTextInput
            control={control}
            name="date_of_birth"
            label="Date of Birth"
            editable={false}
        />
    </TouchableOpacity>
    <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
    /> */}
                </View>

            </ScrollView>
            <Spinner visible={isLoading} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        bottom: 5,
        backgroundColor: '#001C4E',
        height: 180,
        padding: 15
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    backIcon: {
        marginRight: 10,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        top: 60
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'gray',
        backgroundColor: '#fff',
        marginTop: 10,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#fff',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
});

export default EditUserProfile;
