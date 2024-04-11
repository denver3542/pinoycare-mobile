import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button, Title, Appbar, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useVerifyUser } from './hooks/useVerifyUser';

const VerificationScreen = () => {
    const navigation = useNavigation();
    const { mutate: verifyUserMutation, isLoading, isError } = useVerifyUser();
    const { control, handleSubmit, setValue } = useForm();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true); // Set loading to true on submission
            const verification = [
                { frontImage: data.id1FrontImage, backImage: data.id1BackImage },
                { frontImage: data.id2FrontImage, backImage: data.id2BackImage },
                { frontImage: data.id3FrontImage, backImage: data.id3BackImage }
            ];

            // Validate each image URI in the verification array
            const isValidVerification = verification.every(item =>
                item.frontImage && item.backImage && typeof item.frontImage === 'string' && typeof item.backImage === 'string'
            );

            if (!isValidVerification) {
                throw new Error('Invalid verification data. Ensure each image URI is a string.');
            }

            console.log('Verification data:', verification);

            // Use the custom hook to submit the verification data
            await verifyUserMutation(verification);

            console.log('Verification data submitted successfully.');
        } catch (error) {
            console.error('Failed to submit verification:', error);
            Alert.alert('Error', 'Failed to submit verification. Please try again later.');
        } finally {
            setLoading(false); // Reset loading state regardless of success or failure
        }
    };


    const pickImage = async (side, id) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'You need to grant access to your camera roll to pick images.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                // Get the file extension from the URI
                const uriParts = result.assets[0].uri.split('.');
                const fileExtension = uriParts[uriParts.length - 1].toLowerCase();

                // Check if the file extension corresponds to an image format
                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {

                    // Set the selected image URI using setValue
                    setValue(`id${id}${side === 'front' ? 'FrontImage' : 'BackImage'}`, result.assets[0].uri);
                    console.log('Selected image URI:', result.assets[0].uri);
                } else {
                    console.log('Selected file is not an image.');
                    // Optionally, you can show an alert to the user
                    Alert.alert('Invalid file', 'Please select an image file.');
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };



    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.container}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <View key={index}>
                        <Title>{`ID ${index + 1}`}</Title>
                        <Controller
                            control={control}
                            render={({ field: { value } }) => (
                                <View style={styles.imageContainer}>
                                    <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('front', index + 1)}>
                                        {value ? (
                                            <Image source={{ uri: value }} style={styles.image} />
                                        ) : (
                                            <Text style={styles.text}>Tap to upload front image</Text>
                                        )}
                                    </TouchableRipple>
                                </View>
                            )}
                            name={`id${index + 1}FrontImage`}
                        />
                        <Controller
                            control={control}
                            render={({ field: { value } }) => (
                                <View style={styles.imageContainer}>
                                    <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('back', index + 1)}>
                                        {value ? (
                                            <Image source={{ uri: value }} style={styles.image} />
                                        ) : (
                                            <Text style={styles.text}>Tap to upload back image</Text>
                                        )}
                                    </TouchableRipple>
                                </View>
                            )}
                            name={`id${index + 1}BackImage`}
                        />
                    </View>
                ))}
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button mode="outlined" onPress={handleSubmit(onSubmit)}>Submit</Button>
                )}
                {isError && (
                    <Text style={styles.errorText}>Failed to submit verification. Please try again later.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F4F7FB",
    },
    imageContainer: {
        marginVertical: 8,
    },
    imagePicker: {
        backgroundColor: "#0A3480",
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        borderRadius: 14,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 14,
    },
    text: { color: 'white' },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default VerificationScreen;
