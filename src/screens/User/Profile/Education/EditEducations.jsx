import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { IconButton, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../../../hooks/useUser';
import moment from 'moment';

const ChangeEducationScreen = () => {
    const navigation = useNavigation();
    const { user } = useUser();

    const getEducationLevelName = (level) => {
        const educationLevels = {
            'elementary': 'Elementary Education',
            'secondary': 'Junior High School',
            'secondary_k12': 'Senior High School',
            'baccalaureate': 'Baccalaureate',
            'master': 'Masters Degree',
            'doctorate': 'Doctorate'
        };
        return educationLevels[level] || '';
    };

    const renderItem = useMemo(() => ({ item }) => (
        <View style={styles.educationContainer}>
            <View style={styles.row}>
                {/* <Image
                    source={item.media && item.media.length > 0 ? { uri: item.media[0].original_url } : require("../../../../../assets/images/about.jpg")}
                    style={styles.certificateImage}
                /> */}
                <View style={styles.educationContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.educationTitle}>{getEducationLevelName(item.level)}</Text>
                        <IconButton
                            icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                            size={20}
                            onPress={() => navigation.navigate("UpdateEducation", { educationItem: item })}
                            style={styles.iconButton}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <Text style={styles.educationDetail}>
                            {item.school_name.length > 25 ? `${item.school_name.slice(0, 25)}...` : item.school_name}
                        </Text>

                        <Text style={styles.educationDetail}>{moment(item.from).format('MMM YYYY')} - {moment(item.to).format('MMM YYYY')}</Text>
                    </View>
                </View>
            </View>
        </View>
    ), [navigation]);

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
    educationContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 10,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
    },
    educationContent: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    certificateImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },


    iconButton: {
        padding: 0,
        margin: 0,
        marginLeft: 10,
    },
});

export default ChangeEducationScreen;
