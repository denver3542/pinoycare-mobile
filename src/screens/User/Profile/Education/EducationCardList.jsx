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

const d = ({ educations }) => {
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
                <Text style={styles.cardTitle}>Education</Text>
                <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={22} color='#334567' />}
                        size={20}
                        onPress={navigateToAddEducation}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="border-color" size={14} color="#0A3480" />}
                        size={25}
                        onPress={navigateToEditEducation}
                    />
                </View>
            </View>
            <Divider style={{ marginBottom: 5, bottom: 10, color: 'red', height: 1, }} />
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
                        {/* {index < limitedEducations.length - 1 && <Divider style={styles.divider} />} */}
                    </React.Fragment>
                ))}
                {/* <Divider style={styles.divider} /> */}
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
        elevation: 0.5,
        marginBottom: 8,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        bottom: 10
    },

    cardIcon: {
        marginRight: 10,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        // color: '#334567',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    educationItem: { marginVertical: 10, },
    educationContainer: {
        paddingVertical: 0,
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
        // color: '#556789',
        marginBottom: 4,
    },
    educationDescription: {
        fontSize: 14,
        // color: '#556789'
    },
    educationDuration: {
        // color: '#556789',
    },
    showMoreLessButton: {
        alignItems: 'center',
        // marginTop: 10,
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

export default d;
