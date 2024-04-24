import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Divider, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const SkillsChip = ({ skills }) => {
    const navigation = useNavigation();
    const [showAllSkills, setShowAllSkills] = useState(false);
    const displayedSkills = Array.isArray(skills) ? (showAllSkills ? skills : skills.slice(0, 10)) : [];

    const handlePress = () => {
        setShowAllSkills(!showAllSkills);
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.sectionHeader}>
                    {/* <FontAwesome5
                        name="star"
                        size={18}
                        color="#0A3480"
                        style={styles.cardIcon}
                        solid
                    /> */}
                    <Text style={styles.cardTitle}>Skills</Text>
                </View>
                <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={25} color="#0A3480" />}
                        size={25}
                        selected
                        onPress={() => navigation.navigate("AddSkillScreen")}
                    />

                </View>
            </View>
            {/* <Divider style={styles.divider} /> */}
            <View style={styles.skillsContainer}>
                {displayedSkills.map((skillItem, index) => (
                    <Chip mode='outlined' key={index} onPress={() => { }} style={styles.chip}>
                        <Text style={styles.skillText}>{skillItem.skill_name}</Text>
                    </Chip>
                ))}
            </View>

            {!showAllSkills && skills && skills.length > 5 && (
                <TouchableOpacity onPress={handlePress}>
                    <Text style={styles.showAllButton}>Show All</Text>
                </TouchableOpacity>
            )}
            {showAllSkills && (
                <TouchableOpacity onPress={handlePress}>
                    <Text style={styles.showAllButton}>Show Less</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 8,
        padding: 15,
        elevation: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#334567'
    },
    cardIcon: {
        marginRight: 10,
    },
    divider: {
        height: 0.5,
        marginBottom: 10,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 4,
        borderRadius: 10,
    },
    skillText: {
        fontSize: 10,
        color: '#556789'
    },
    iconContainer: {
        flexDirection: 'row',
    },
    showAllButton: {
        color: '#0A3480',
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold'
    }
});

export default SkillsChip;
