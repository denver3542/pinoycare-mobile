import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, Divider, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const SkillsChip = ({ skill }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={styles.sectionHeader}>
                    <FontAwesome5
                        name="star"
                        size={18}
                        color="#0A3480"
                        style={styles.cardIcon}
                        solid
                    />
                    <Text style={styles.cardTitle}>Skills</Text>
                </View>
                <View style={styles.iconContainer}>
                    <IconButton
                        icon={() => <MaterialIcons name="add" size={25} color="#0A3480" />}
                        size={25}
                        selected
                        onPress={() => navigation.navigate("AddSkillScreen")}
                    />
                    <IconButton
                        icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                        size={25}
                        selected
                        onPress={() => { /* Handle edit button press */ }}
                    />
                </View>
            </View>
            <Divider style={styles.divider} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {skill.map((skillItem, index) => (
                    <Chip
                        key={index}
                        onPress={() => { }}
                        style={styles.chip}
                    >
                        <Text style={styles.smallFont}>{skillItem.skill_name}</Text>
                    </Chip>
                ))}
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
        elevation: 1,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#0A3480'
    },
    cardIcon: {
        marginRight: 10,
    },
    divider: {
        height: 0.5,
        marginBottom: 10,
    },
    chip: {
        margin: 4,
        borderRadius: 10,
    },
    smallFont: {
        fontSize: 10,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        marginHorizontal: 2,
        padding: 0,
    },
});

export default SkillsChip;
