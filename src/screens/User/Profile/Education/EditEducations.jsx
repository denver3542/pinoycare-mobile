import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { IconButton, Appbar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../../../hooks/useUser';

const ChangeEducationScreen = () => {
    const navigation = useNavigation();
    const { user } = useUser();

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
                return 'Masters Degree';
            case 'doctorate':
                return 'Doctorate';
            default:
                return '';
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.educationContainer}>
            <View style={styles.levelContainer}>
                <Text style={styles.educationTitle}>{getEducationLevelName(item.level)}</Text>
                <IconButton
                    icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                    size={25}
                    selected
                    onPress={() => navigation.navigate("UpdateEducation", { educationItem: item })}
                />

            </View>
            <Text style={styles.educationDetail}>School: {item.school_name}</Text>
            {item.course && <Text style={styles.educationDetail}>Course: {item.course}</Text>}
            <Text style={styles.educationDetail}>From: {item.from}</Text>
            <Text style={styles.educationDetail}>To: {item.to}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Edit Education" />
            </Appbar.Header>
            <FlatList
                data={user.educations}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    levelContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
    },
    content: {
        flex: 1,
        backgroundColor: '#F4F7FB',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0A3480',
    },
    educationContainer: {
        backgroundColor: 'white',
        padding: 15,
        marginTop: 5,
        borderRadius: 10,
        paddingVertical: 8,
        elevation: 1
    },
    educationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0A3480',
    },
    educationDetail: {
        fontSize: 14,
        color: '#555',
    },
});

export default ChangeEducationScreen;
