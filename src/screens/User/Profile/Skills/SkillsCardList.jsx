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

                    <TouchableOpacity onPress={() => navigation.navigate("AddSkillScreen")}>
                        <Text style={styles.cardTitle} >Skills</Text>
                    </TouchableOpacity>
                </View>


            </View>
            <Divider style={{ bottom: 10, color: 'red', height: 1, }} />
            <View style={styles.skillsContainer}>
                {displayedSkills.map((skillItem, index) => (
                    <Chip textStyle={{
                        minHeight: 12,
                        lineHeight: 12,
                        marginRight: 10,
                        marginLeft: 10,
                        marginVertical: 5
                    }} mode='outlined' key={index} style={styles.chip}>
                        <Text style={styles.skillText}>{skillItem.skill_name}</Text>
                    </Chip>
                ))}
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 8,
        padding: 15,
        borderWidth: 0.5,
        borderColor: '#ddd'
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        bottom: 10
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#0A3480'
    },
    cardIcon: {
        marginRight: 10,
    },
    divider: {
        height: 0.5,
        // marginBottom: 10,
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
        // color: '#556789'
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
