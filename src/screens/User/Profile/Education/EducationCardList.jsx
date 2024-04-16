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

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={styles.sectionContent}>
                        <FontAwesome5 name="graduation-cap" size={20} color="#0A3480" style={styles.cardIcon} />
                        <Text style={styles.cardTitle}>Education</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <IconButton
                            icon={() => <MaterialIcons name="add" size={25} color="#0A3480" />}
                            size={20}
                            onPress={() => navigation.navigate("AddEducationScreen")}
                        />
                        <IconButton
                            icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                            size={25}
                            onPress={() => navigation.navigate("EditEducation")}
                        />
                    </View>
                </View>
                {/* <Divider style={styles.divider} /> */}
                <View style={styles.educationContainer}>
                    {limitedEducations.map((education, index) => (
                        <React.Fragment key={index}>
                            <View style={styles.education}>
                                {education.media && education.media.length > 0 ? (
                                    <Image
                                        source={{ uri: education.media[0].original_url }}
                                        style={styles.certificateImage}
                                    />
                                ) : (
                                    <Image
                                        source={require("../../../../../assets/images/about.jpg")}
                                        style={styles.certificateImage}
                                    />
                                )}

                                <View style={styles.educationDetails}>
                                    <Text style={styles.educationTitle}>{getEducationLevelName(education.level)}</Text>
                                    <Text style={styles.educationDescription}>{education.school_name}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <Text style={styles.educationDescription}>
                                            {moment(education.from).format('MMM YYYY')} - {moment(education.to).format('MMM YYYY')}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Add a Divider between each education item */}
                            {index < limitedEducations.length - 1 && (
                                <Divider style={styles.divider} />
                            )}
                        </React.Fragment>
                    ))}
                </View>
                <Divider style={styles.divider} />
                {educations?.length > 1 && !showAllEducations && (
                    <TouchableOpacity onPress={() => setShowAllEducations(true)} style={styles.showMoreLessButton}>
                        <Text style={styles.showMoreLessText}>Show More</Text>
                    </TouchableOpacity>
                )}
                {showAllEducations && (
                    <TouchableOpacity onPress={() => setShowAllEducations(false)} style={styles.showMoreLessButton}>
                        <Text style={styles.showMoreLessText}>Show Less</Text>
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
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 20,
    },
    cardContent: {
        justifyContent: 'center',
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
        fontSize: 16,
        color: '#0A3480',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    divider: {
        height: 1,
        backgroundColor: '#DDD',
        marginVertical: 10,
    },
    educationContainer: {
        paddingVertical: 5
    },
    education: {
        // marginBottom: 20,
        flexDirection: 'row',
        // alignItems: 'center',
    },
    educationDetails: {
        flexDirection: 'column',
        marginLeft: 15
    },
    educationTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#0A3480',
    },
    educationDescription: {
        fontSize: 14,
    },
    certificateImage: {
        width: 80,
        height: 80,
        borderRadius: 10
    },
    showMoreLessButton: {
        alignItems: 'center',
    },
    showMoreLessText: {
        color: '#0A3480',
        fontWeight: 'bold',
    },
});

export default EducationItem;
