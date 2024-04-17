import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const getEducationLevelName = (level) => {
    switch (level) {
        case 'elementary':
            return 'Elementary Education';
        case 'secondary':
            return 'Junior High School';
        case 'secondary_k12':
            return 'Senior High School';
        case 'baccalaureate':
            return 'Baccalaureate';
        case 'master':
            return 'Master\'s Degree';
        case 'doctorate':
            return 'Doctorate';
        default:
            return '';
    }
};

const EducationItem = ({ educations }) => {
    const [showAllEducations, setShowAllEducations] = useState(false);
    const limitedEducations = showAllEducations ? educations : educations.slice(0, 3);
    const navigation = useNavigation();

    const navigateToAddEducation = () => {
        navigation.navigate("AddEducationScreen");
    };

    const navigateToEditEducation = () => {
        navigation.navigate("EditEducation");
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <View style={styles.sectionContent}>
                    {/* <FontAwesome5 name="graduation-cap" size={20} color="#0A3480" style={styles.cardIcon} /> */}
                    <Text style={styles.cardTitle}>Education</Text>
                </View>
                <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={25} color="#0A3480" />}
                        size={20}
                        onPress={navigateToAddEducation}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                        size={25}
                        onPress={navigateToEditEducation}
                    />
                </View>
            </View>
            <View style={styles.educationContainer}>
                {limitedEducations.map((education, index) => (
                    <React.Fragment key={index}>
                        <View style={styles.educationItem}>
                            <View style={styles.educationDetails}>
                                <Text style={styles.educationTitle}>{education.school_name}</Text>
                                <View style={styles.educationRow}>
                                    <Text style={styles.educationDescription}>{getEducationLevelName(education.level)}</Text>
                                    <Text style={styles.educationDuration}>
                                        {moment(education.from).format('MMM YYYY')} - {moment(education.to).format('MMM YYYY')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {index < limitedEducations.length - 1 && <Divider style={styles.divider} />}
                    </React.Fragment>
                ))}
                <Divider style={styles.divider} />
            </View>
            {educations?.length > 1 && (
                <TouchableOpacity onPress={() => setShowAllEducations((prev) => !prev)} style={styles.showMoreLessButton}>
                    <Text style={styles.showMoreLessText}>
                        {showAllEducations ? "Show Less" : "Show More"}
                    </Text>
                </TouchableOpacity>
            )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        marginRight: 10,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#0A3480',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    educationContainer: {
        paddingVertical: 10,
    },
    educationItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    educationDetails: {
        flex: 1,
    },
    educationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    educationTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#0A3480',
        marginBottom: 4,
    },
    educationDescription: {
        fontSize: 14,
    },
    educationDuration: {
        color: '#555',
    },
    showMoreLessButton: {
        alignItems: 'center',
        // marginVertical: 10,
    },
    showMoreLessText: {
        color: '#0A3480',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
});

export default EducationItem;
