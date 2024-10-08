import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Button, Title, Appbar, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from '../../../../../utils/axiosConfig';
import { useUser } from '../../../../hooks/useUser';

const VerificationScreen = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const { control, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        let formData = new FormData();
        let imageCount = 0;

        ['1', '2'].forEach(id => {
            const frontImage = data[`id${id}FrontImage`];

            if (frontImage) {
                imageCount++;
                formData.append(`verification[]`, {
                    uri: frontImage,
                    type: `image/${frontImage.split('.').pop().toLowerCase()}`,
                    name: `frontImage_${id}.${frontImage.split('.').pop().toLowerCase()}`,
                });
            }
        });

        if (imageCount === 0) {
            Alert.alert('No Image', 'Please upload at least one image.');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/user/profile/submit-verification', formData, {
                headers: {
                    ...getJWTHeader(user),
                    'Content-Type': 'multipart/form-data',
                }
            });

            await AsyncStorage.setItem('verificationData', JSON.stringify(response.data));
            queryClient.invalidateQueries('verificationData');
            navigation.navigate('Account');
            console.log(response.data);
        } catch (error) {
            console.error('Failed to submit verification:', error);
            Alert.alert('Error', 'Failed to submit verification. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async (id) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant camera roll access.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            let imageFileType = uri.split('.').pop().toLowerCase();
            if (imageFileType !== 'jpeg' && imageFileType !== 'png' && imageFileType !== 'jpg') {
                Alert.alert('Invalid File Type', 'Please select a JPEG or PNG image file.');
                return;
            }

            setValue(`id${id}FrontImage`, uri);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
            </Appbar.Header>
            <View style={styles.container}>
                {Array.from({ length: 1 }).map((_, index) => (
                    <View key={index}>
                        <Controller
                            control={control}
                            render={({ field: { value } }) => (
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage(index + 1)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload image</Text>
                                    )}
                                </TouchableRipple>
                            )}
                            name={`id${index + 1}FrontImage`}
                            defaultValue=""
                        />
                    </View>
                ))}

                <Button mode="outlined" loading={loading} onPress={handleSubmit(onSubmit)}>Submit</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F4F7FB",
        flex: 1
    },
    imagePicker: {
        backgroundColor: "#0A3480",
        justifyContent: 'center',
        height: 150,
        borderRadius: 14,
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
        borderRadius: 14,
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default VerificationScreen;
