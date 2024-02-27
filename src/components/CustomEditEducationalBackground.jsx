import React, { useState } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Divider, TextInput, RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const placeholderImage = require('../../assets/images/about.jpg');
const CustomEditEducationalBackground = ({ visible, onClose, onSave }) => {
    const [educationalBackground, setEducationalBackground] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedRadioButton, setSelectedRadioButton] = useState('');
    const [selectedImage, setSelectedImage] = useState('');



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

        if (!result.cancelled) {
            setSelectedImage(result.uri);
        }
    };

    const handleSave = () => {
        onSave(educationalBackground, selectedRadioButton);
        setEducationalBackground('');
        setSelectedRadioButton('');
        setSelectedImage('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />


                <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 15, width: '92%' }}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}
                        onPress={onClose}
                        pointerEvents="box-none"
                    >
                        <FontAwesome5 name="times-circle" size={24} color="#0A347F" solid />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Edit Educational Background</Text>
                    <Text style={{ paddingBottom: 5, fontWeight: 'bold', color: 'gray', marginTop: 20 }}>Elementary</Text>
                    <Divider />
                    <View style={{ marginTop: 10, marginBottom: 20 }}>
                        <TextInput
                            mode="outlined"
                            label="School Name"
                            placeholder="Type something"
                            right={<TextInput.Affix />}
                            value={educationalBackground}
                            onChangeText={setEducationalBackground}
                            style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                mode="outlined"
                                label="Start Date"
                                placeholder="Select Date"
                                right={<TextInput.Affix />}
                                value={startDate.toLocaleDateString()}
                                style={{ backgroundColor: 'white', height: 40, marginBottom: 20, marginRight: 5 }}
                                editable={false}
                            />
                            <TextInput
                                mode="outlined"
                                label="End Date"
                                placeholder="Select Date"
                                right={<TextInput.Affix />}
                                value={endDate.toLocaleDateString()}
                                style={{ backgroundColor: 'white', height: 40, marginBottom: 20 }}
                                editable={false}
                            />
                        </View>

                        <Text style={{ paddingBottom: 5, fontWeight: 'bold', color: 'gray', marginTop: 20 }}>Junior High School</Text>
                        <Divider />

                        <View>
                            <Text style={{ marginTop: 10, fontSize: 14, marginRight: 50 }}>Are you a K to 12 student?</Text>
                            <RadioButton.Group onValueChange={value => setSelectedRadioButton(value)} value={selectedRadioButton}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => setSelectedRadioButton("Yes")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>Yes</Text>
                                        <RadioButton value="Yes" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setSelectedRadioButton("No")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>No</Text>
                                        <RadioButton value="No" />
                                    </TouchableOpacity>
                                </View>
                            </RadioButton.Group>
                        </View>

                        <Text style={{ paddingBottom: 5, fontWeight: 'bold', color: 'gray', marginTop: 20 }}>Baccalaureate</Text>
                        <Divider />
                        <View style={{ marginTop: 10 }}>
                            <TextInput
                                mode="outlined"
                                label="School Name"
                                placeholder="Type something"
                                right={<TextInput.Affix />}
                                value={educationalBackground}
                                onChangeText={setEducationalBackground}
                                style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                            />
                            <TextInput
                                mode="outlined"
                                label="Course"
                                placeholder="Type something"
                                right={<TextInput.Affix />}
                                value={educationalBackground}
                                onChangeText={setEducationalBackground}
                                style={{ backgroundColor: 'white', marginBottom: 10, height: 40 }}
                            />

                            <TouchableOpacity onPress={handleImagePicker}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage }} style={[styles.image]} />
                                ) : (
                                    <Image source={placeholderImage} style={[styles.image]} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={{ borderRadius: 20, overflow: 'hidden' }}
                    >
                        <View style={{ backgroundColor: '#0A347F', paddingVertical: 12, paddingHorizontal: 20 }}>
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 14 }}>Save</Text>
                        </View>
                    </TouchableOpacity>
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

export default CustomEditEducationalBackground;
