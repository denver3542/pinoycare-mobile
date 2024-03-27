import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Appbar, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../../components/CustomTextInput';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from "../../../hooks/useUser";
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import * as ImagePicker from 'expo-image-picker';

const defaultProfileImage = require('../../../../assets/images/default-men.png');

const EditUserProfileScreen = () => {
    const navigation = useNavigation();
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [gender, setGender] = useState(user?.gender || '');
    const [profileImage, setProfileImage] = useState(user?.media[0]?.original_url || defaultProfileImage); // Set profile image from user data if available
    const [isLoading, setIsLoading] = useState(false);
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            "firstname": user?.firstname || '',
            "middlename": user?.middlename || '',
            "lastname": user?.lastname || '',
            "phone": user?.phone || '',
            "email": user?.email || '',
            "gender": user?.gender || '',
            "permanent_address": user?.permanent_address || '',
            "current_address": user?.current_address || '',
        }
    });

    const updateProfile = async (dataToUpdate) => {
        try {
            setIsLoading(true);
            const user = JSON.parse(await AsyncStorage.getItem('upcare_user'));
            const headers = getJWTHeader(user);
            const { data } = await axiosInstance.put(`/user/profile/update`, {
                ...dataToUpdate,
                gender: gender
            }, { headers });
            const updatedUser = { ...user, ...dataToUpdate };
            queryClient.setQueryData(['user'], updatedUser);
            AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
            console.log('Profile update successful:', data);
            return data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfilePictureUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Permission to access camera roll is required!');
            }
            const imagePickerResponse = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (imagePickerResponse.canceled) {
                console.log('Image picker cancelled by user.');
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append('profile', {
                uri: imagePickerResponse.assets[0].uri,
                name: 'profile_picture.jpg',
                type: 'image/jpeg',
            });

            const user = JSON.parse(await AsyncStorage.getItem('upcare_user'));
            const headers = {
                ...getJWTHeader(user),
                'Content-Type': 'multipart/form-data',
            };
            const { data } = await axiosInstance.post(`/user/profile/change-profile`, formData, { headers });

            setProfileImage(data.profile_picture);

            const updatedUser = { ...user, profile_picture: data.profile_picture };
            AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
            queryClient.setQueryData(['user'], updatedUser);
            queryClient.invalidateQueries(['user']);

            console.log('Profile picture updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating profile picture:', error.message);
            if (error.message === 'Permission to access camera roll is required!') {
                alert('Permission to access camera roll is required!');
            } else {
                alert('An error occurred while updating profile picture. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };




    const onSubmit = async (data) => {
        data.gender = gender;
        await updateProfile(data);
        navigation.goBack();
    };


    const handleGenderChange = (value) => {
        setGender(value);
    };


    useEffect(() => {
        setValue("gender", gender);
    }, [gender, setValue]);

    return (
        <AuthenticatedLayout>
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Profile" />
                    <Appbar.Action icon="cog" onPress={() => navigation.navigate("SettingsScreen")} />
                </Appbar.Header>
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <View style={styles.imageUpdate}>
                            <Image
                                source={
                                    user && user.media[0]
                                        ? { uri: user.media[0].original_url }
                                        : require("../../../../assets/images/sample-profile.jpg")
                                }
                                style={styles.profileImage}
                            />

                            <Button icon="camera" mode="contained" onPress={handleProfilePictureUpload}>
                                Upload
                            </Button>
                        </View>

                    </View>
                </View>

                <View style={{ padding: 8 }}>
                    <CustomTextInput
                        control={control}
                        name="firstname"
                        label="First Name"
                        mode="outlined"
                    />
                    <CustomTextInput
                        control={control}
                        name="middlename"
                        label="Middle Name"
                        mode="outlined"
                    />
                    <CustomTextInput
                        control={control}
                        name="lastname"
                        label="Last Name"
                        mode="outlined"
                    />

                    <View style={styles.genderRadioButton}>
                        <View style={{}}>
                            <Text style={{ fontSize: 16 }}>Choose Gender</Text>
                        </View>
                        <View style={styles.radioGroup}>
                            <RadioButton
                                value="M"
                                status={gender === 'M' ? 'checked' : 'unchecked'}
                                onPress={() => handleGenderChange('M')}
                            />
                            <Text>Male</Text>

                            <RadioButton
                                value="F"
                                status={gender === 'F' ? 'checked' : 'unchecked'}
                                onPress={() => handleGenderChange('F')}
                            />
                            <Text>Female</Text>
                        </View>
                    </View>

                    <CustomTextInput
                        control={control}
                        name="phone"
                        label="Phone"
                        mode="outlined"
                    />
                    <CustomTextInput
                        control={control}
                        name="email"
                        label="Email"
                        mode="outlined"
                    />
                    <CustomTextInput
                        control={control}
                        label="Permanent Address"
                        name="permanent_address"
                        mode="outlined"
                    />
                    <CustomTextInput
                        control={control}
                        label="Current Address"
                        name="current_address"
                        mode="outlined"
                    />

                    <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                        Save
                    </Button>
                </View>

                <Spinner visible={isLoading} />
            </View>
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 8,
    },
    headerContainer: {
        backgroundColor: 'white',
        elevation: 0.5,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        height: 180
    },
    imageUpdate: {
        alignItems: 'center',
        flexDirection: 'column'
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 80,
        backgroundColor: 'white',
        marginTop: 10,
        margin: 5
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    genderRadioButton: {
        flexDirection: 'row',
        justifyContent: 'space-round',
        alignItems: 'center',
        marginBottom: 4
    }
});

export default EditUserProfileScreen;
