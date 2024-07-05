import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appbar, Divider, IconButton } from 'react-native-paper';
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
                <Text style={styles.loadMoreButtonText}>Load More</Text>
            )}
        </TouchableOpacity>
    );
};

const EditWorkExperience = () => {
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

    const renderItem = useMemo(() => {
        return ({ item }) => (
            <View style={styles.itemContainer}>
                <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTitle}>{item.position}</Text>
                        <IconButton
                            style={styles.iconButton}
                            icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                            size={20}
                            onPress={() => navigation.navigate("UpdateWorkExperience", { experienceItem: item })}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.descriptionText}>{item.company_name}</Text>
                        <Text style={styles.contentText}>{moment(item.date_started).format('MMM YYYY')} - {moment(item.date_ended).format('MMM YYYY')}</Text>
                    </View>
                    <Text style={styles.descriptionText}>{item.salary}</Text>
                    <Divider style={styles.divider} />
                    <View>
                        <Text style={styles.sectionTitle}>Contact Person Detail</Text>
                        <Text style={styles.descriptionText}>{item.contact_person}</Text>
                        <Text style={styles.descriptionText}>{item.contact_phone}</Text>
                        <Text style={styles.descriptionText}>{item.contact_position}</Text>
                    </View>
                </View>
            </View>
        );
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={navigation.goBack} color='white' />
                <Appbar.Content title="Edit Work Experience" titleStyle={styles.appbarTitle} />
                <Appbar.Action icon={() => <MaterialIcons name="add" size={24} color="white" />} onPress={() => navigation.navigate("AddWorkExperience")} />
            </Appbar.Header>
            <FlatList
                data={user.work_experiences.slice(0, visibleItems)}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={
                    user.work_experiences.length > visibleItems ? (
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
    appbar: {
        backgroundColor: '#0A3480',
    },
    appbarTitle: {
        color: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 8,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 10,
        elevation: 1,
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0A3480',
    },
    descriptionText: {
        fontSize: 14,
        textAlign: 'justify',
    },
    contentText: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    iconButton: {
        padding: 0,
        margin: 0,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    divider: {
        marginTop: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: 'gray',
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
});

export default EditWorkExperience;
