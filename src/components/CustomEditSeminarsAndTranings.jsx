import React, { useState } from "react";
import {
    Text,
    View,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    Button
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider, TextInput, RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const placeholderImage = require("../../assets/images/about.jpg");

const CustomEditSeminarsAndTranings = ({ visible, onClose, onSave }) => {
    const [educationalBackground, setEducationalBackground] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedImage, setSelectedImage] = useState("");

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
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
        setEducationalBackground("");
        setSelectedImage("");
        onClose();
    };

    // Get the width of the screen
    const screenWidth = Dimensions.get("window").width;

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '92%', maxHeight: '80%' }}>

                    <TouchableOpacity
                        style={{ position: "absolute", top: 20, right: 20, zIndex: 1 }}
                        onPress={onClose}
                        pointerEvents="box-none"
                    >
                        <FontAwesome5 name="times-circle" size={24} color="#0A347F" solid />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, marginBottom: 10 }}>
                        Edit Seminars & Trainings
                    </Text>

                    <ScrollView>
                        <View style={{ marginTop: 10, marginBottom: 20 }}>
                            <TextInput
                                mode="outlined"
                                label="Facilitated By"
                                placeholder=""
                                right={<TextInput.Affix />}
                                value={educationalBackground}
                                onChangeText={setEducationalBackground}
                                style={{ backgroundColor: "white", marginBottom: 10, height: 40 }}
                            />

                            <TextInput
                                mode="outlined"
                                label="Description"
                                placeholder=""
                                right={<TextInput.Affix />}
                                value={educationalBackground}
                                onChangeText={setEducationalBackground}
                                style={{ backgroundColor: "white", marginBottom: 10, height: 40 }}
                            />
                            <View style={{ flexDirection: "row" }}>
                                <TextInput
                                    mode="outlined"
                                    label="Start Date"
                                    placeholder="Select Date"
                                    right={<TextInput.Affix />}
                                    value={startDate.toLocaleDateString()}
                                    style={{
                                        backgroundColor: "white",
                                        height: 40,
                                        marginBottom: 20,
                                        marginRight: 5,
                                    }}
                                    editable={false}
                                />
                                <TextInput
                                    mode="outlined"
                                    label="End Date"
                                    placeholder="Select Date"
                                    right={<TextInput.Affix />}
                                    value={endDate.toLocaleDateString()}
                                    style={{
                                        backgroundColor: "white",
                                        height: 40,
                                        marginBottom: 20,
                                    }}
                                    editable={false}
                                />
                            </View>
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
                        <View style={{ borderRadius: 20, overflow: 'hidden' }}>
                            <Button
                                onPress={handleSave}
                                title="Save"
                                color="#0A347F"
                            />
                        </View>

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
        width: "auto",
    },
});

export default CustomEditSeminarsAndTranings;
