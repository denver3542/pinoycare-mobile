import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { useUser } from "../../../hooks/useUser";
import CustomTextInput from '../../../components/CustomTextInput';
import { useForm } from "react-hook-form";

const defaultProfileImage = require('../../../../assets/images/default-men.png');

const EditUserProfile = () => {
    const { user } = useUser();
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            "firstname": user?.firstname || "",
            "middlename": user?.middlename || "",
            "lastname": user?.lastname || "",
            "phone": user?.phone || "",
            "email": user?.email || "", // Assuming you have the email field in your user object
            "permanent_address": user?.permanent_address || "",
            "current_address": user?.current_address || "",
            "date_of_birth": user?.date_of_birth || ""
        }
    });
    const navigation = useNavigation();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateInputFocused, setDateInputFocused] = useState(false);
    const [profileImage, setProfileImage] = useState(defaultProfileImage);

    const selectImage = async () => {
        // Your image selection logic here
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        setDateOfBirth(date);
    };

    const handleDateInputFocus = () => {
        setDateInputFocused(true);
        showDatePicker();
    };

    const handleDateInputChange = (text) => {
        // Handle text input for date if needed
    };

    const handleSaveChanges = () => {
        // Handle save changes logic here
        console.log('Save changes');
    };

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
                        <TouchableOpacity onPress={handleSaveChanges}>
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
                    <CustomTextInput
                        control={control}
                        name="date_of_birth"
                    />
                </View>
            </ScrollView>
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
        // marginLeft: 100,
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
});

export default EditUserProfile;
