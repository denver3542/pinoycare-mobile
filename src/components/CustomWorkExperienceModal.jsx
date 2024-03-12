import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
const placeholderImage = require('../../assets/images/about.jpg');
const CustomWorkExperienceModal = ({ visible, onClose, onSave }) => {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [dateStarted, setDateStarted] = useState(null);
    const [dateEnded, setDateEnded] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartDatePicker, setIsStartDatePicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const showDatePicker = (isStartDate) => {
        setDatePickerVisibility(true);
        setIsStartDatePicker(isStartDate);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        if (isStartDatePicker) {
            setDateStarted(date);
        } else {
            setDateEnded(date);
        }
        hideDatePicker();
    };
    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.uri);
        }
    };
    const handleSave = () => {
        onSave({ company, position, dateStarted, dateEnded });
        setSelectedImage('');
        onClose();
    };

    const handleAddExperience = () => {

    };


    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '92%', maxHeight: '80%' }}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}
                        onPress={onClose}
                        pointerEvents="box-none"
                    >
                        <FontAwesome5 name="times-circle" size={24} color="#0A347F" solid />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>Add Work Experience</Text>
                    <ScrollView style={{ marginBottom: 20, }}>
                        <TextInput
                            mode="outlined"
                            label="Company Name"
                            placeholder=""
                            right={<TextInput.Affix />}
                            value={company}
                            onChangeText={text => setCompany(text)}
                            style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Position"
                            placeholder=""
                            right={<TextInput.Affix />}
                            value={position}
                            onChangeText={text => setPosition(text)}
                            style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => showDatePicker(true)} style={{ flex: 1 }}>
                                <TextInput
                                    mode="outlined"
                                    label="Date Started"
                                    value={dateStarted ? dateStarted.toLocaleDateString() : 'Select Date'}
                                    editable={false}
                                    style={{ backgroundColor: 'white', marginBottom: 10, height: 40, marginRight: 5 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => showDatePicker(false)} style={{ flex: 1 }}>
                                <TextInput
                                    mode="outlined"
                                    label="Date Ended"
                                    value={dateEnded ? dateEnded.toLocaleDateString() : 'Select Date'}
                                    editable={false}
                                    style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Divider style={{ marginVertical: 10 }} />
                        <Text style={{ fontWeight: 'bold', color: 'gray' }}>
                            Contact Person Detail
                        </Text>
                        <View>
                            <TextInput
                                mode="outlined"
                                label="Contact Person Name"
                                placeholder=""
                                right={<TextInput.Affix />}
                                value={company}
                                onChangeText={text => setCompany(text)}
                                style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                            />
                            <TextInput
                                mode="outlined"
                                label="Phone Number"
                                placeholder=""
                                right={<TextInput.Affix />}
                                value={company}
                                onChangeText={text => setCompany(text)}
                                style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                            />
                            <TextInput
                                mode="outlined"
                                label="Position"
                                placeholder=""
                                right={<TextInput.Affix />}
                                value={company}
                                onChangeText={text => setCompany(text)}
                                style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                            />

                            <TouchableOpacity
                                onPress={handleImagePicker}
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderStyle: "dashed",
                                    borderWidth: 1,
                                    borderColor: "gray",
                                    borderRadius: 5,
                                    padding: 10,
                                    marginBottom: 10,
                                }}
                            >
                                {selectedImage ? (
                                    <>
                                        <Image
                                            source={{ uri: selectedImage }}
                                            style={[styles.image]}
                                        />
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 5,
                                                right: 5,
                                                backgroundColor: "#fff",
                                                padding: 5,
                                                borderRadius: 5,
                                            }}
                                        >
                                            Change
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text>Select Image</Text>
                                        <Image source={placeholderImage} style={[styles.image]} />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            headerTextIOSStyle={{ color: '#001C4E' }}
                            pickerContainerStyleIOS={{ backgroundColor: '#ede9e8' }}
                            textColor={Platform.OS === 'ios' ? 'black' : '#001C4E'}
                        />


                        <View style={{ marginVertical: 10 }}>
                            <Button
                                onPress={handleSave}
                                mode="contained"
                                labelStyle={{ color: 'white' }}
                            >
                                Save
                            </Button>
                        </View>

                        <Button
                            onPress={handleAddExperience}
                            mode="outlined"

                        >
                            Add Experience
                        </Button>


                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    image: {
        height: 170,
        marginBottom: 10,
        width: "auto"
    },
});
export default CustomWorkExperienceModal;
