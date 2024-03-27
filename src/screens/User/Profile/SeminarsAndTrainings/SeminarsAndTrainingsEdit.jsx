import React from 'react';
import { Text, StyleSheet, View, FlatList, Image } from 'react-native';
import { IconButton, Appbar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../../hooks/useUser';

const SeminarsAndTrainingsEdit = () => {
    const navigation = useNavigation();
    const { user } = useUser();

    const renderItem = ({ item }) => (
        <View style={styles.trainingsContainer}>
            <View style={styles.sectionContainer}>
                <Text style={styles.textTitle}>{item.facilitated_by}</Text>
                <IconButton
                    icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                    size={25}
                    selected
                    onPress={() => navigation.navigate("UpdateSeminars", { seminarsItem: item })}
                />
            </View>

            {item.media.length > 0 ? (
                item.media.map((mediaItem, index) => (
                    <Image
                        key={index}
                        source={{ uri: mediaItem.original_url }}
                        style={styles.mediaImage}
                    />
                ))
            ) : (
                <Image
                    source={require('../../../../../assets/images/sample-profile.jpg')}
                    style={styles.mediaImage}
                />
            )}
            <Text style={styles.descriptionText}>{item.description}</Text>
            <Text style={styles.contentText}>Date Started: {item.date_started}</Text>
            <Text style={styles.contentText}>Date Completed: {item.date_completed}</Text>
        </View>
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
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
    trainingsContainer: {
        backgroundColor: 'white',
        padding: 15,
        marginTop: 8,
        borderRadius: 10,
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    descriptionText: {
        fontSize: 15,
        textAlign: 'justify',
        marginBottom: 5,
        width: '100%',
    },
    contentText: {
        fontSize: 14,
        width: '100%',
    },
    textTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0A3480',
        width: '70%',
    },
    mediaImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    }
});

export default SeminarsAndTrainingsEdit;
