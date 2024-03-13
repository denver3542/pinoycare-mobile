import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const VerificationScreen = () => {
    const [idFront, setIdFront] = useState(null);
    const [selfie, setSelfie] = useState(null);

    const pickImage = async (setImage) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.step}>
                <Text style={styles.instruction}>Please provide a photo of the front of your driver's license</Text>
                <Button title="Photo of Front ID" onPress={() => pickImage(setIdFront)} />
                {idFront && <Image source={{ uri: idFront }} style={styles.image} />}
            </View>

            <View style={styles.step}>
                <Text style={styles.instruction}>Finally, we just need a selfie of you straight on</Text>
                <Button title="Photo of a Selfie" onPress={() => pickImage(setSelfie)} />
                {selfie && <Image source={{ uri: selfie }} style={styles.image} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    step: {
        marginBottom: 20,
        alignItems: 'center',
    },
    instruction: {
        marginBottom: 10,
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
});

export default VerificationScreen;
