import React, { useMemo } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../../hooks/useUser';
import moment from 'moment';

const SeminarsAndTrainingsEdit = () => {
    const navigation = useNavigation();
    const { user } = useUser();

    const renderItem = useMemo(
        () => ({ item }) => {
            const truncatedDescription =
                item.description.length > 25
                    ? `${item.description.substring(0, 25)}...`
                    : item.description;

            return (
                <View style={styles.itemContainer}>
                    <View style={styles.textContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.titleText}>{item.facilitated_by}</Text>
                            <IconButton
                                icon={() => (
                                    <MaterialIcons name="edit" size={20} color="#0A3480" />
                                )}
                                onPress={() =>
                                    navigation.navigate('SeminarsAndTrainingsUpdate', {
                                        seminarsItem: item,
                                    })
                                }
                                size={20}
                                style={styles.editButton}
                            />
                        </View>
                        <Text style={styles.descriptionText}>{truncatedDescription}</Text>
                        <Text style={styles.dateText}>
                            {moment(item.date_started).format('MMM YYYY')} -{' '}
                            {moment(item.date_completed).format('MMM YYYY')}
                        </Text>
                    </View>
                </View>
            );
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Edit Seminars" />
            </Appbar.Header>
            <FlatList
                data={user.trainings}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    listContainer: {
        padding: 15,
    },
    itemContainer: {
        backgroundColor: '#FFF',
        padding: 8,
        marginBottom: 12,
        elevation: 1,
    },
    textContainer: {
        flex: 1,
        paddingLeft: 12,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 8,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0A3480',
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
        // marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    editButton: {
        padding: 0,
        margin: 0,
    },
});

export default SeminarsAndTrainingsEdit;
