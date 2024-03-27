import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Divider } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const WorkExperience = ({ work_experiences }) => {
    const [showAllWorkExperience, setShowAllWorkExperience] = useState(false);
    const experience = showAllWorkExperience ? work_experiences : work_experiences.slice(0, 1);
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={styles.sectionContent}>
                    <FontAwesome5
                        name="users"
                        size={18}
                        color="#0A3480"
                        style={styles.cardIcon}
                        solid
                    />
                    <Text style={styles.cardTitle}>Work Experience</Text>
                </View>
                <IconButton
                    icon="plus-box"
                    size={20}
                    selected
                    onPress={() => { }}
                />
            </View>
            <Divider style={styles.divider} />
            <View>
                {experience.map((experience, index) => (
                    <View key={index} style={styles.experience}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.educationTitle}>Company: {experience.company_name}
                            </Text>
                            <IconButton
                                icon="pencil-box"
                                size={20}
                                selected
                                onPress={() => navigation.navigate("EditEducationScreen")}
                            />
                        </View>
                        <Text style={[styles.educationDescription]}>Description: {experience.position}</Text>
                        <Text style={styles.educationDescription}>Salary: {experience.salary}</Text>
                        <Text style={styles.educationDescription}>Contact Person: {experience.contact_person}</Text>
                        <Text style={styles.educationDescription}>Position: {experience.contact_position}</Text>
                        <Text style={styles.educationDescription}>Phone: {experience.contact_phone}</Text>
                        <Text style={styles.educationDescription}>Date Started: {experience.date_started}</Text>
                        <Text style={styles.educationDescription}>Date Completed: {experience.date_ended}</Text>

                    </View>

                ))}
                {!showAllWorkExperience && work_experiences.length > 3 && (
                    <TouchableOpacity
                        onPress={() => setShowAllWorkExperience(true)}
                        style={{ alignItems: 'center', marginTop: 10 }}
                    >
                        <Text style={{ color: '#0A3480', fontWeight: 'bold' }}>Show More</Text>
                    </TouchableOpacity>
                )}
                {showAllWorkExperience && (
                    <TouchableOpacity
                        onPress={() => setShowAllWorkExperience(false)}
                        style={{ alignItems: 'center', marginTop: 10 }}
                    >
                        <Text style={{ color: '#0A3480', fontWeight: 'bold' }}>Show Less</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    sectionContainer: {
        marginBottom: 20
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#0A3480",
        paddingVertical: 30,
        paddingHorizontal: 15,
        height: 200,
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerName: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    headerProfession: {
        color: "white",
        fontSize: 16,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 100,
        marginRight: 20,
    },
    button: {
        marginLeft: 10
    },
    flexReverse: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
    },
    contentStyle: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: "#F4F7FB",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    sectionContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        marginBottom: 8,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },

    cardContent: {
        justifyContent: 'center',
        flex: 1
    },

    contentContainer: { margin: 10 },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#0A3480'
    },

    description: {
        fontSize: 16,
        marginBottom: 3,
        color: "#555",
    },

    educationTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    educationItem: {
        padding: 20
    },
    cardIcon: {
        marginRight: 10,
    },
    chip: {
        margin: 4,
        borderRadius: 20,
    },
    divider: {
        height: 0.5,
        marginBottom: 10,
    },
    educationItem: {
        marginBottom: 10,
    },
    educationTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#0A3480",
    },
    educationDescription: {
        marginBottom: 5,
    },

});

export default WorkExperience;
