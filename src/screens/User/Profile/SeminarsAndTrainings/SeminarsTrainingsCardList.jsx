import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { IconButton, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const SeminarsTrainings = ({ trainings }) => {
    const [showAllSeminarsAndTrainings, setShowAllSeminarsAndTrainings] = useState(false);
    const displayedTrainings = showAllSeminarsAndTrainings ? trainings : trainings.slice(0, 3);
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <View style={styles.sectionContent}>
                    {/* <MaterialIcons name="school" size={24} color="#0A3480" style={styles.cardIcon} /> */}
                    <Text style={styles.cardTitle}>Seminars and Trainings</Text>
                </View>
                <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={25} color="#334567" />}
                        onPress={() => navigation.navigate("AddSeminarsAndTrainings")}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="border-color" size={18} color="#334567" />}
                        onPress={() => navigation.navigate("SeminarsAndTrainingsEdit")}
                    />
                </View>
            </View>
            <View style={styles.contentContainer}>
                {displayedTrainings.map((training, index) => (
                    <React.Fragment key={index}>
                        <View style={styles.trainingItem}>
                            {/* 
                            <View style={styles.imageContainer}>
                                {training.media && training.media.length > 0 ? (
                                    <Image
                                        source={{ uri: training.media[0].original_url }}
                                        style={styles.certificateImage}
                                    />
                                ) : (
                                    <Image
                                        source={require("../../../../../assets/images/about.jpg")}
                                        style={styles.certificateImage}
                                    />
                                )}
                            </View> 
                            */}
                            <View style={styles.textContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.trainingTitle}>{training.facilitated_by}</Text>
                                    <Text style={styles.trainingDuration}>
                                        {moment(training.date_started).format('MMM YYYY')} - {moment(training.date_completed).format('MMM YYYY')}
                                    </Text>
                                </View>
                                <Text style={styles.trainingDescription}>
                                    {training.description.length > 200
                                        ? `${training.description.slice(0, 200)}...`
                                        : training.description}
                                </Text>

                            </View>
                        </View>
                        {index < displayedTrainings.length - 1 && (
                            <Divider style={styles.divider} />
                        )}
                    </React.Fragment>
                ))}
                <Divider style={styles.divider} />
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
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 10,
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
        fontSize: 20,
        // color: "#334567",
    },
    iconContainer: {
        flexDirection: 'row',
    },
    contentContainer: {
        flex: 1,
    },
    trainingItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
    },
    trainingTitle: {
        fontWeight: "bold",
        fontSize: 16,
        // color: '#0A3480',
        marginBottom: 4,
    },
    trainingDescription: {
        color: "#555",
        marginBottom: 4,
    },
    trainingDuration: {
        // color: "#555",
    },
    showMoreButton: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    showMoreText: {
        color: '#0A3480',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginBottom: 10,
    },
    imageContainer: {
        marginRight: 10,
    },
    certificateImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
});

export default SeminarsTrainings;
