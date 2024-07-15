import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { IconButton, Appbar, Dialog, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import { useUser } from '../../../../hooks/useUser';

const LoadMoreButton = ({ onPress, loading }) => (
    <TouchableOpacity style={styles.loadMoreButton} onPress={onPress} disabled={loading}>
        {loading ? (
            <ActivityIndicator size="small" color="black" />
        ) : (
            <Text style={styles.loadMoreButtonText}>Load More</Text>
        )}
    </TouchableOpacity>
);

const ChangeEducationScreen = () => {
    const navigation = useNavigation();
    const { user, deleteEducation } = useUser();
    const [visibleItems, setVisibleItems] = useState(5);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [educationIdToDelete, setEducationIdToDelete] = useState(null);

    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
            setLoading(false);
        }, 1000);
    };

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

    const handleDelete = (educationId) => {
        deleteEducation(educationId, {
            onSuccess: () => {
                console.log("Education deleted successfully");
            },
            onError: (error) => {
                console.error('Error deleting education:', error);
            }
        });
    };

    const renderRightActions = (progress, dragX, itemId) => {
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
                        setEducationIdToDelete(itemId);
                        setDialogVisible(true);
                    }}
                >
                    <MaterialIcons name="delete" size={30} color="gray" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderItem = useMemo(() => ({ item }) => (
        <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
        >
            <View style={styles.educationContainer}>
                <View style={styles.row}>
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
        </Swipeable>
    ), [navigation]);

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                <Appbar.Content title="Education" titleStyle={{ color: 'white' }} />
                <Appbar.Action icon={() => <MaterialIcons name="add" size={24} color="white" />} onPress={() => navigation.navigate("AddEducationScreen")} />
            </Appbar.Header>
            <FlatList
                data={user.educations.slice(0, visibleItems)}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={
                    user.educations.length > visibleItems ? (
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
                        handleDelete(educationIdToDelete);
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
    iconButton: {
        padding: 0,
        margin: 0,
        marginLeft: 10,
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

export default ChangeEducationScreen;
