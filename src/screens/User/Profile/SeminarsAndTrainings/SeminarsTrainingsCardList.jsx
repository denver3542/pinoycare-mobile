import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { IconButton, Divider } from "react-native-paper";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const SeminarsTrainings = ({ trainings }) => {
    const [showAllSeminarsAndTrainings, setShowAllSeminarsAndTrainings] = useState(false);
    const limitedTrainings = showAllSeminarsAndTrainings ? trainings : trainings.slice(0, 3);
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <View style={styles.sectionContent}>
                    <FontAwesome5
                        name="users"
                        size={18}
                        color="#0A3480"
                        style={styles.cardIcon}
                        solid
                    />
                    <Text style={styles.cardTitle}>Seminars and Trainings</Text>
                </View>
                <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={25} color="#0A3480" />}
                        onPress={() => navigation.navigate("AddSeminarsAndTrainings")}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                        onPress={() => navigation.navigate("SeminarsAndTrainingsEdit")}
                    />
                </View>
            </View>
            <Divider style={styles.divider} />
            <View>
                {limitedTrainings.map((training, index) => (
                    <React.Fragment key={index}>
                        <View style={styles.trainingItem}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={training.certificate ? { uri: training.media[0].original_url } : require("../../../../../assets/images/about.jpg")}
                                    style={styles.certificateImage}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.trainingTitle}>{training.facilitated_by}</Text>
                                <Text style={styles.trainingDescription}> {training.description.length > 50 ? `${training.description.slice(0, 50)}...` : training.description}</Text>
                                <Text style={styles.trainingDuration}>
                                    {moment(training.date_started).format('MMM YYYY')} - {moment(training.date_completed).format('MMM YYYY')}
                                </Text>
                            </View>
                        </View>
                        {index < limitedTrainings.length - 1 && (
                            <Divider style={styles.divider} />
                        )}
                    </React.Fragment>
                ))}

                {trainings.length > 3 && (
                    <TouchableOpacity
                        onPress={() => setShowAllSeminarsAndTrainings(!showAllSeminarsAndTrainings)}
                        style={styles.showMoreButton}
                    >
                        <Text style={styles.showMoreText}>
                            {showAllSeminarsAndTrainings ? "Show Less" : "Show More"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        marginVertical: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardIcon: {
        marginRight: 10,
    },
    cardTitle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#0A3480",
    },
    iconContainer: {
        flexDirection: 'row',
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginBottom: 15,
    },
    trainingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    imageContainer: {
        width: 90,
        height: 90,
        marginRight: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    certificateImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    trainingTitle: {
        fontWeight: "bold",
        color: "#0A3480",
        marginBottom: 4,
    },
    trainingDescription: {
        color: "#555",
        marginBottom: 4,
    },
    trainingDuration: {
        color: "#555",
    },
    showMoreButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    showMoreText: {
        color: '#0A3480',
        fontWeight: 'bold',
    },
});

export default SeminarsTrainings;
