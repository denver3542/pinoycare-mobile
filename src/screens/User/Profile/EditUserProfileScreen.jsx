import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Appbar, RadioButton, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../../components/CustomTextInput';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from "../../../hooks/useUser";
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from "../../../hooks/useAuth";
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const defaultProfileImage = require('../../../../assets/images/default-men.png');

const EditUserProfileScreen = () => {
    const { deleteUser } = useAuth();
    const navigation = useNavigation();
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [gender, setGender] = useState(user?.gender || '');
    const [profileImage, setProfileImage] = useState(user?.media[0]?.original_url || defaultProfileImage);
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
            "preferred_rate": user?.preferred_rate || '',
            "profession": user?.profession || '',
        }
    });

    const saveBottomSheetRef = useRef(null);
    const deleteBottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '30%'], []);

    const handleCloseSaveBottomSheet = () => saveBottomSheetRef.current?.close();
    const handleOpenSaveBottomSheet = () => {
        Keyboard.dismiss();
        setTimeout(() => saveBottomSheetRef.current?.expand(), 50);
    };
    const handleCloseDeleteBottomSheet = () => deleteBottomSheetRef.current?.close();
    const handleOpenDeleteBottomSheet = () => deleteBottomSheetRef.current?.expand();

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
            AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
            queryClient.setQueryData(['user'], updatedUser);
            queryClient.invalidateQueries(['user']);
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
        handleCloseSaveBottomSheet();
    };

    const handleGenderChange = (value) => {
        setGender(value);
    };

    useEffect(() => {
        setValue("gender", gender);
    }, [gender, setValue]);

    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const handleInputFocus = () => {
        if (saveBottomSheetRef.current) {
            saveBottomSheetRef.current.close();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                    <Appbar.Content title="Profile" titleStyle={{ color: 'white' }} />
                    <Appbar.Action icon="content-save" color="white" onPress={handleOpenSaveBottomSheet} />
                </Appbar.Header>
                <ScrollView>
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
                                <IconButton
                                    mode="outlined"
                                    selected
                                    icon="camera"
                                    size={16}
                                    style={styles.cameraIcon}
                                    onPress={handleProfilePictureUpload}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ padding: 8 }}>
                        <CustomTextInput
                            control={control}
                            name="firstname"
                            label="First Name"
                            mode="outlined"
                            onFocus={handleInputFocus}
                        />
                        <CustomTextInput
                            control={control}
                            name="middlename"
                            label="Middle Name"
                            mode="outlined"
                            onFocus={handleInputFocus}
                        />
                        <CustomTextInput
                            control={control}
                            name="lastname"
                            label="Last Name"
                            mode="outlined"
                            onFocus={handleInputFocus}
                        />

                        <View style={styles.genderRadioButton}>
                            <View>
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
                            onFocus={handleInputFocus}
                        />
                        <CustomTextInput
                            control={control}
                            name="email"
                            label="Email"
                            mode="outlined"
                            onFocus={handleInputFocus}
                        />
                        <CustomTextInput
                            control={control}
                            label="Permanent Address"
                            name="permanent_address"
                            mode="outlined"
                            onFocus={handleInputFocus}
                        />
                        <CustomTextInput
                            control={control}
                            label="Current Address"
                            name="current_address"
                            mode="outlined"
                            onFocus={handleInputFocus}
                        />
                        <CustomTextInput
                            control={control}
                            label="Preferred Rate"
                            name="preferred_rate"
                            mode="outlined"
                            type="money"
                            onFocus={handleInputFocus}
                        />
                        <CustomTextInput
                            control={control}
                            label="Profession"
                            name="profession"
                            mode="outlined"
                            onFocus={handleInputFocus}
                        />

                        <Button mode="contained" onPress={handleOpenDeleteBottomSheet} labelStyle={{ color: 'white' }}>
                            Delete Account
                        </Button>
                    </View>
                </ScrollView>
                <Spinner visible={isLoading} />
                <BottomSheet
                    ref={saveBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                >
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Confirm Save</Text>
                        <Text>Are you sure you want to save these changes?</Text>
                        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                            Save Changes
                        </Button>
                        <Button onPress={handleCloseSaveBottomSheet} style={styles.button}>
                            Cancel
                        </Button>
                    </View>
                </BottomSheet>

                <BottomSheet
                    ref={deleteBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                >
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Delete Account</Text>
                        <Text>Are you sure you want to delete your account?</Text>
                        <Button mode="contained" onPress={deleteUser} style={styles.button}>
                            Yes, Delete
                        </Button>
                        <Button onPress={handleCloseDeleteBottomSheet} style={styles.button}>
                            Cancel
                        </Button>
                    </View>
                </BottomSheet>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB'
    },
    header: {
        padding: 8,
    },
    headerContainer: {
        backgroundColor: '#0A3480',
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
        margin: 5,
        borderWidth: 2,
        borderColor: 'white'
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
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
    },
    bottomSheetContent: { paddingHorizontal: 20, paddingVertical: 15 },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
});


export default EditUserProfileScreen;
