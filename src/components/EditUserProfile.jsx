import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { useUser } from "../../hooks/useUser";
const defaultProfileImage = require('../../assets/images/default-men.png');

const EditUserProfile = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateInputFocused, setDateInputFocused] = useState(false);
    const [profileImage, setProfileImage] = useState(defaultProfileImage); // State for the profile image

    // Function to handle image selection
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

        // Check if assets array is not empty
        if (pickerResult.assets.length > 0) {
            // Access the first asset from the array (assuming a single image is selected)
            const selectedImage = pickerResult.assets[0];
            // Update the profile image with the selected image URI
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

        <View style={{ ...styles.container }}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', top: 30 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FontAwesome5 name="arrow-left" size={20} color="white" solid style={styles.backIcon} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Edit Profile</Text>
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
                <View style={{ padding: 15, marginTop: 40 }}>
                    <View>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput mode='outlined' style={styles.input} />
                    </View>
                    <View>
                        <Text style={styles.label}>Middle Name</Text>
                        <TextInput mode='outlined' style={styles.input} />
                    </View>
                    <View>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput mode='outlined' style={styles.input} />
                    </View>
                    <View>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput mode='outlined' style={styles.input} />
                    </View>
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput mode='outlined' style={styles.input} />
                    </View>
                    <View>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity onPress={handleDateInputFocus}>
                            <TextInput
                                mode='outlined'
                                style={[styles.input, dateInputFocused ? { borderColor: 'blue' } : null]} // Added conditional styling for focus
                                onChangeText={handleDateInputChange}
                                value={dateOfBirth ? dateOfBirth.toDateString() : ''}
                                editable={false} // Disable manual text input
                            />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            date={new Date()} // Set the initial date value for the picker
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />

                    </View>
                    <Button mode="contained" labelStyle={{ color: 'white' }} onPress={handleSaveChanges}>Save Changes</Button>
                </View>
            </ScrollView>
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
        marginLeft: 100,
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
    input: {
        borderColor: '#ccc',
        marginBottom: 20,
        borderRadius: 5,
        height: 40,
    },
});

export default EditUserProfile;
