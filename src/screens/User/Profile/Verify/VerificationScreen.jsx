import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Button, Title, Appbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const VerificationScreen = () => {
    const navigation = useNavigation();
    const [id1FrontImage, setId1FrontImage] = React.useState(null);
    const [id1BackImage, setId1BackImage] = React.useState(null);
    const [id2FrontImage, setId2FrontImage] = React.useState(null);
    const [id2BackImage, setId2BackImage] = React.useState(null);
    const [id3FrontImage, setId3FrontImage] = React.useState(null);
    const [id3BackImage, setId3BackImage] = React.useState(null);

    const pickImage = async (imageType, idNumber) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            switch (idNumber) {
                case 1:
                    if (imageType === 'front') {
                        setId1FrontImage(result.uri);
                    } else {
                        setId1BackImage(result.uri);
                    }
                    break;
                case 2:
                    if (imageType === 'front') {
                        setId2FrontImage(result.uri);
                    } else {
                        setId2BackImage(result.uri);
                    }
                    break;
                case 3:
                    if (imageType === 'front') {
                        setId3FrontImage(result.uri);
                    } else {
                        setId3BackImage(result.uri);
                    }
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                {/* <Appbar.Content title="ID Verification" /> */}
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.container}>
                {/* ID 1 */}
                <View>
                    <Title>ID 1</Title>
                    {/* ID 1 Front */}
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('front', 1)}>
                            {id1FrontImage ? (
                                <Image source={{ uri: id1FrontImage }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}>Tap to upload front image</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* ID 1 Back */}
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('back', 1)}>
                            {id1BackImage ? (
                                <Image source={{ uri: id1BackImage }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}>Tap to upload back image</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ID 2 */}
                <View>
                    <Title>ID 2</Title>
                    {/* ID 2 Front */}
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('front', 2)}>
                            {id2FrontImage ? (
                                <Image source={{ uri: id2FrontImage }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}> Tap to upload front image</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* ID 2 Back */}
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('back', 2)}>
                            {id2BackImage ? (
                                <Image source={{ uri: id2BackImage }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}>Tap to upload back image</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ID 3 */}
                <View>
                    <Title>ID 3</Title>
                    {/* ID 3 Front */}
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('front', 3)}>
                            {id3FrontImage ? (
                                <Image source={{ uri: id3FrontImage }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}>Tap to upload front image</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {/* ID 3 Back */}
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('back', 3)}>
                            {id3BackImage ? (
                                <Image source={{ uri: id3BackImage }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}>Tap to upload back image</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <Button mode="outlined" onPress={() => console.log('Skip For Now')}>Submit</Button>
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
