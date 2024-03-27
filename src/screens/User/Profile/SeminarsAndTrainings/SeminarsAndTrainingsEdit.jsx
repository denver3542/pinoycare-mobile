import React from 'react';
import { Text, StyleSheet, View, FlatList, Image } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../../hooks/useUser';

const SeminarsAndTrainingsEdit = () => {
    const navigation = useNavigation();
    const { user } = useUser();


    const renderItem = ({ item }) => {
        let description = item.description;
        if (description.length > 100) {
            description = description.substring(0, 100) + '...';
        }

        return (
            <View style={styles.itemContainer}>
                {/* <View style={styles.imageContainer}>
                    <Image
                        source={item.media.length > 0 ? { uri: item.media[0].original_url } : require('../../../../../assets/images/sample-profile.jpg')}
                        style={styles.mediaImage}
                    />
                </View> */}
                <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.textTitle}>{item.facilitated_by}</Text>
                        <IconButton selected icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />} size={25} onPress={() => handleEdit(item)} />
                    </View>
                    <Text style={styles.descriptionText}>{description}</Text>
                    <View style={{ flexDirection: 'column', }}>
                        <Text style={styles.contentText}>Start: {item.date_started}</Text>
                        <Text style={styles.contentText}>End: {item.date_completed}</Text>
                    </View>
                </View>
            </View>
        );
    };


    const handleEdit = (item) => {
    };

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
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 0,
        borderRadius: 10,
        elevation: 1,
        alignItems: 'center'
    },
    imageContainer: {
        marginRight: 10,
    },
    mediaImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        margin: 8
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
    },
});

export default SeminarsAndTrainingsEdit;
