import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Appbar, IconButton, Dialog, Paragraph, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../../hooks/useUser';
import { Swipeable } from 'react-native-gesture-handler';
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
    const { user, deleteTraining } = useUser();
    const [visibleItems, setVisibleItems] = useState(5);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [seminarsIdToDelete, setSeminarsIdToDelete] = useState(null);

    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
            setLoading(false);
        }, 1000);
    };

    const hasMoreItems = user.trainings.length > visibleItems;

    const handleDelete = (trainingId) => {
        deleteTraining(trainingId, {
            onSuccess: () => {
                console.log("Deleted Successfully");
            },
            onError: (error) => {
                console.log("Error Deleting:", error.message);
            }
        });
    };

    const renderRightActions = (progress, dragX, trainingId) => {
        const trans = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={styles.rightActionContainer}>
                <TouchableOpacity
                    style={[styles.deleteButton, { transform: [{ translateX: trans }] }]}
                    onPress={() => {
                        setSeminarsIdToDelete(trainingId);
                        setDialogVisible(true);
                    }}
                >
                    <MaterialIcons name="delete" size={30} color="gray" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderItem = useMemo(
        () => ({ item }) => {
            const truncatedDescription =
                item.description.length > 25
                    ? `${item.description.substring(0, 25)}...`
                    : item.description;

            return (
                <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
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
                </Swipeable>
            );
        },
        [navigation]
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                <Appbar.Content title="Seminars and Trainings" titleStyle={{ color: 'white' }} />
                <Appbar.Action icon={() => <MaterialIcons name="add" size={24} color="white" />} onPress={() => navigation.navigate("AddSeminarsAndTrainings")} />
            </Appbar.Header>
            <FlatList
                data={user.trainings.slice(0, visibleItems)}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={
                    hasMoreItems ? (
                        <LoadMoreButton onPress={loadMore} loading={loading} />
                    ) : null
                }
            />

            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title>Confirm Delete</Dialog.Title>
                <Dialog.Content>
                    <Paragraph>Are you sure you want to delete this?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                    <Button onPress={() => {
                        handleDelete(seminarsIdToDelete);
                        setDialogVisible(false);
                    }}>Delete</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB'
    },
    itemContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 10,
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
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0A3480',
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    loadMoreButtonText: {
        color: '#556789',
        fontWeight: 'bold',
    },
    rightActionContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteButton: {
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        borderRadius: 8,
        margin: 8,
    },
});

export default SeminarsAndTrainingsEdit;
