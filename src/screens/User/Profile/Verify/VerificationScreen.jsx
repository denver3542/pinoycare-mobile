import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Button, Title, Appbar, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useVerifyUser } from './hooks/useVerifyUser';

const VerificationScreen = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            verification: {
                id1FrontImage: '',
                id1BackImage: '',
                id2FrontImage: '',
                id2BackImage: '',
                id3FrontImage: '',
                id3BackImage: '',
            }
        }
    });
    const verifyUserMutation = useVerifyUser();

    const pickImage = async (imageType, idNumber) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (result && !result.cancelled && result.assets && result.assets.length > 0) {
                const selectedImageUri = result.assets[0].uri;

                setValue(`verification.id${idNumber}${imageType.charAt(0).toUpperCase() + imageType.slice(1)}Image`, selectedImageUri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const onSubmit = async (data) => {
        try {
            // Ensure that all required fields are included in the data object
            const formData = {
                verification: {
                    id1FrontImage: data.verification.id1FrontImage,
                    id1BackImage: data.verification.id1BackImage,
                    id2FrontImage: data.verification.id2FrontImage,
                    id2BackImage: data.verification.id2BackImage,
                    id3FrontImage: data.verification.id3FrontImage,
                    id3BackImage: data.verification.id3BackImage,
                }
                // Add other fields if required by the backend
            };

            await verifyUserMutation.mutateAsync(formData);
        } catch (error) {
            console.error('Failed to submit verification:', error);
            Alert.alert('Error', 'Failed to submit verification. Please try again.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.container}>
                {/* ID 1 */}
                <View>
                    <Title>ID 1</Title>
                    {/* ID 1 Front */}
                    <Controller
                        control={control}
                        render={({ field: { value } }) => (
                            <View style={styles.imageContainer}>
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('front', 1)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload front image</Text>
                                    )}
                                </TouchableRipple>
                            </View>
                        )}
                        name="verification.id1FrontImage"
                    />
                    {/* ID 1 Back */}
                    <Controller
                        control={control}
                        render={({ field: { value } }) => (
                            <View style={styles.imageContainer}>
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('back', 1)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload back image</Text>
                                    )}
                                </TouchableRipple>
                            </View>
                        )}
                        name="verification.id1BackImage"
                    />
                </View>

                {/* ID 2 */}
                <View>
                    <Title>ID 2</Title>
                    {/* ID 2 Front */}
                    <Controller
                        control={control}
                        render={({ field: { value } }) => (
                            <View style={styles.imageContainer}>
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('front', 2)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload front image</Text>
                                    )}
                                </TouchableRipple>
                            </View>
                        )}
                        name="verification.id2FrontImage"
                    />
                    {/* ID 2 Back */}
                    <Controller
                        control={control}
                        render={({ field: { value } }) => (
                            <View style={styles.imageContainer}>
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('back', 2)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload back image</Text>
                                    )}
                                </TouchableRipple>
                            </View>
                        )}
                        name="verification.id2BackImage"
                    />
                </View>

                {/* ID 3 */}
                <View>
                    <Title>ID 3</Title>
                    {/* ID 3 Front */}
                    <Controller
                        control={control}
                        render={({ field: { value } }) => (
                            <View style={styles.imageContainer}>
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('front', 3)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload front image</Text>
                                    )}
                                </TouchableRipple>
                            </View>
                        )}
                        name="verification.id3FrontImage"
                    />
                    {/* ID 3 Back */}
                    <Controller
                        control={control}
                        render={({ field: { value } }) => (
                            <View style={styles.imageContainer}>
                                <TouchableRipple style={styles.imagePicker} onPress={() => pickImage('back', 3)}>
                                    {value ? (
                                        <Image source={{ uri: value }} style={styles.image} />
                                    ) : (
                                        <Text style={styles.text}>Tap to upload back image</Text>
                                    )}
                                </TouchableRipple>
                            </View>
                        )}
                        name="verification.id3BackImage"
                    />
                </View>

                <Button mode="outlined" onPress={handleSubmit(onSubmit)}>Submit</Button>
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
    text: { color: 'white' }
});

export default VerificationScreen;
