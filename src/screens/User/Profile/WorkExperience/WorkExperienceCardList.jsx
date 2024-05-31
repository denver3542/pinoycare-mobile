import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const WorkExperience = ({ work_experiences }) => {
    const [showAllWorkExperience, setShowAllWorkExperience] = useState(false);
    const experiencesToShow = showAllWorkExperience ? work_experiences : work_experiences.slice(0, 3);
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <View style={styles.sectionContent}>
                    <Text style={styles.cardTitle}>Work Experience</Text>
                </View>
                <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={22} color="#0A3480" />}
                        onPress={() => navigation.navigate("AddWorkExperience")}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="border-color" size={14} color="#0A3480" />}
                        onPress={() => navigation.navigate("EditWorkExperience")}
                    />
                </View>
            </View>
            <Divider style={{ marginBottom: 5, bottom: 10, color: 'red', height: 1, }} />
            <View>
                {experiencesToShow.map((experience, index) => (
                    <React.Fragment key={index}>
                        <View style={styles.experience}>
                            <Text style={styles.educationTitle}>{experience.position}</Text>
                            <View style={styles.row}>
                                <Text style={styles.educationDescription}>{experience.company_name}</Text>
                                <Text style={styles.educationDescription}>{moment(experience.date_started).format('MMM YYYY')} - {moment(experience.date_ended).format('MMM YYYY')}</Text>
                            </View>
                            {/* <Text style={styles.educationDescription}>Salary: {experience.salary}</Text>
                            <Text style={styles.educationDescription}>Contact Person: {experience.contact_person}</Text>
                            <Text style={styles.educationDescription}>Contact Position: {experience.contact_position}</Text>
                            <Text style={styles.educationDescription}>Contact Phone: {experience.contact_phone}</Text> */}
                        </View>
                        {/* {index < experiencesToShow.length - 1 && (
                            <Divider style={styles.divider} />
                        )} */}
                    </React.Fragment>
                ))}
                {/* <Divider style={styles.divider} /> */}
                {work_experiences.length > 3 && (
                    <TouchableOpacity
                        onPress={() => setShowAllWorkExperience(!showAllWorkExperience)}
                        style={styles.showMoreButton}
                    >
                        <Text style={styles.showMoreText}>{showAllWorkExperience ? "Show Less" : "Show More"}</Text>
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
        marginBottom: 15,
        padding: 15,
        elevation: 0,
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
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        // color: '#0A3480',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    experience: {
        marginBottom: 10,
        // backgroundColor: '#CFDDE6', borderRadius: 14, padding: 15
    },
    educationTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        // color: '#0A3480',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    educationDescription: {
        color: '#555',
    },
    divider: {
        marginVertical: 10,
        height: 1
    },
    showMoreButton: {
        alignItems: 'center',
    },
    showMoreText: {
        color: '#0A3480',
        fontWeight: 'bold',
    },
});

export default WorkExperience;
