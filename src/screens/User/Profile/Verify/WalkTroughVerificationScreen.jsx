import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Title, Paragraph, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const WalkThroughVerificationScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                {/* <Appbar.Content title="ID Verification" /> */}
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <Text style={styles.description}>
                        Please ensure you upload a minimum of three IDs for the verification process.
                        It is important that these IDs are clear and readable. Thank you!
                    </Text>

                    <View style={styles.imageContainer}>
                        <Title style={styles.imageTitle}>FRONT</Title>
                        <Paragraph style={styles.imageDescription}>
                            Make Sure it's Readable and Clear <Text style={styles.imageDescriptionRed}>*</Text>
                        </Paragraph>
                        <Image
                            source={require('../../../../../assets/images/front_sample.png')}
                            style={styles.image}
                        />
                    </View>

                    <View style={styles.imageContainer}>
                        <Title style={styles.imageTitle}>BACK</Title>
                        <Paragraph style={styles.imageDescription}>
                            Make Sure it's Readable and Clear <Text style={styles.imageDescriptionRed}>*</Text>
                        </Paragraph>
                        <Image
                            source={require('../../../../../assets/images/back_sample.png')}
                            style={styles.image}
                        />
                    </View>

                    <Button mode="contained" onPress={() => navigation.navigate("VerificationScreen")} style={styles.nextButton}>Next</Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: "#F4F7FB"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        textAlign: 'justify',
        marginBottom: 20,
    },
    imageContainer: {
        marginBottom: 20,
    },
    imageTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    imageDescription: {
        textAlign: 'justify',
        marginBottom: 10,
    },
    imageDescriptionRed: {
        color: 'red',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },
    nextButton: {
        marginTop: 20,
    },
});

export default WalkThroughVerificationScreen;
