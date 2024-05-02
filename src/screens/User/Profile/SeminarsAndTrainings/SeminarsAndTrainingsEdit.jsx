import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../../hooks/useUser';
import moment from 'moment';

const LoadMoreButton = ({ onPress, loading }) => {
    return (
        <TouchableOpacity style={styles.loadMoreButton} onPress={onPress} disabled={loading}>
            {loading ? (
                <ActivityIndicator size="small" color="black" />
            ) : (
                <Text style={styles.loadMoreButtonText}>Show More</Text>
            )}
        </TouchableOpacity>
    );
};

const SeminarsAndTrainingsEdit = () => {
    const navigation = useNavigation();
    const { user } = useUser();
    const [visibleItems, setVisibleItems] = useState(5);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {

        setLoading(true);
        setTimeout(() => {
            setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
            setLoading(false);
        }, 1000);
    };

    const hasMoreItems = user.trainings.length > visibleItems;

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
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                <Appbar.Content title="Edit Seminars" titleStyle={{ color: 'white' }} />
            </Appbar.Header>
            <FlatList
                data={user.trainings.slice(0, visibleItems)}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={
                    hasMoreItems ? (
                        <LoadMoreButton onPress={loadMore} loading={loading} />
                    ) : null
                }
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
        padding: 8,
    },
    itemContainer: {
        backgroundColor: '#FFF',
        padding: 8,
        marginBottom: 8,
        elevation: 1,
        borderRadius: 14
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
    loadMoreButton: {
        // backgroundColor: '#0A3480',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    loadMoreButtonText: {
        color: '#556789',
        fontWeight: 'bold',
    },
});

export default SeminarsAndTrainingsEdit;
