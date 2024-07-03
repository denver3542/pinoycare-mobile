import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { IconButton, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { color } from "@rneui/base";

const SeminarsTrainings = ({ trainings }) => {
    const [showAllSeminarsAndTrainings, setShowAllSeminarsAndTrainings] = useState(false);
    const displayedTrainings = showAllSeminarsAndTrainings ? trainings : trainings.slice(0, 3);
    const navigation = useNavigation();
    const [expandedTrainings, setExpandedTrainings] = useState({});
    const toggleTrainingExpansion = (index) => {
        setExpandedTrainings(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };
    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <View style={styles.sectionContent}>
                    {/* <MaterialIcons name="school" size={24} color="#0A3480" style={styles.cardIcon} /> */}
                    <TouchableOpacity onPress={() => navigation.navigate("SeminarsAndTrainingsEdit")}>
                        <Text style={styles.cardTitle}>Seminars and Trainings</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={22} color="#334567" />}
                        onPress={() => navigation.navigate("AddSeminarsAndTrainings")}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="border-color" size={14} color="#334567" />}
                        onPress={() => navigation.navigate("SeminarsAndTrainingsEdit")}
                    />
                </View> */}
            </View>
            <Divider style={{ marginBottom: 5, bottom: 10, color: 'red', height: 1, }} />
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
                                </View>
                                <Text style={styles.trainingDescription}>
                                    {expandedTrainings[index] || training.description.length <= 100
                                        ? training.description
                                        : `${training.description.slice(0, 100)}...`}{training.description.length > 100 &&
                                            <TouchableOpacity onPress={() => toggleTrainingExpansion(index)}>
                                                <Text style={styles.showMoreText}>
                                                    {expandedTrainings[index] ? " Read Less" : " Read More"}
                                                </Text>
                                            </TouchableOpacity>
                                    }
                                </Text>
                                <Text style={styles.trainingDuration}>
                                    {moment(training.date_started).format('MMM YYYY')} - {moment(training.date_completed).format('MMM YYYY')}
                                </Text>

                            </View>
                        </View>
                        {/* {index < displayedTrainings.length - 1 && (
                            <Divider style={styles.divider} />
                        )} */}
                    </React.Fragment>
                ))}
                {/* <Divider style={styles.divider} /> */}
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
        elevation: 0,
        marginBottom: 8,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        bottom: 10
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
        color: "#0A3480",
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
        flex: 1,
        textAlign: 'justify'
    },
    trainingDuration: {
        // color: "#555",
    },
    showMoreButton: {
        alignItems: 'center',
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
