import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Button, Title, Appbar, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import axiosInstance, { getJWTHeader } from '../../../../../utils/axiosConfig';
import { useUser } from '../../../../hooks/useUser';

const VerificationScreen = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const { control, handleSubmit, setValue, getValues } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        let formData = new FormData();
        let imageCount = 0;

        ['1', '2', '3'].forEach(id => {
            const frontImage = data[`id${id}FrontImage`];
            const backImage = data[`id${id}BackImage`];

            if (frontImage || backImage) {
                imageCount++;
            }

            if (frontImage) {
                formData.append(`verification[]`, {
                    uri: frontImage,
                    type: `image/${frontImage.split('.').pop().toLowerCase()}`,
                    name: `frontImage_${id}.${frontImage.split('.').pop().toLowerCase()}`,
                });
            }

            if (backImage) {
                formData.append(`verification[]`, {
                    uri: backImage,
                    type: `image/${backImage.split('.').pop().toLowerCase()}`,
                    name: `backImage_${id}.${backImage.split('.').pop().toLowerCase()}`,
                });
            }
        });

        // Check if the minimum number of images is met
        if (imageCount < 2) {
            setLoading(false);
            Alert.alert('Insufficient Images', 'Please submit at least 2 IDs Front and Back.');
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


            navigation.navigate('Account');
            console.log(response.data);
        } catch (error) {
            console.error('Failed to submit verification:', error);
            Alert.alert('Error', 'Failed to submit verification. Please try again later.');
        } finally {
            setLoading(false);
        }
    };



    const pickImage = async (side, id) => {
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
            const { uri, type } = result.assets[0];
            let imageFileType = uri.split('.').pop().toLowerCase();
            if (imageFileType !== 'jpeg' && imageFileType !== 'png') {
                Alert.alert('Invalid File Type', 'Please select a JPEG or PNG image file.');
                return;
            }

            setValue(`id${id}${side === 'front' ? 'FrontImage' : 'BackImage'}`, uri);
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
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('front', index + 1)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload front image</Text>
                                    )}
                                </TouchableRipple>
                            )}
                            name={`id${index + 1}FrontImage`}
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render={({ field: { value } }) => (
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('back', index + 1)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload back image</Text>
                                    )}
                                </TouchableRipple>
                            )}
                            name={`id${index + 1}BackImage`}
                            defaultValue=""
                        />
                    </View>
                ))}

                <Button mode="outlined" loading={loading} onPress={handleSubmit(onSubmit)}>Submit</Button>


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
        alignItems: 'center',
    },
    imagePicker: {
        backgroundColor: "#0A3480",
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: '100%',
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
