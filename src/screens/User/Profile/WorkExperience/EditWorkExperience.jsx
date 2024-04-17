import React, { useMemo } from 'react';
import { Text, StyleSheet, View, FlatList, Image } from 'react-native';
import { Appbar, Divider, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../../hooks/useUser';
import moment from 'moment';

const EditWorkExperience = () => {
    const navigation = useNavigation();
    const { user } = useUser();

    const renderItem = useMemo(() => {
        return ({ item }) => {

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
                            <Text style={styles.textTitle}>{item.position}</Text>
                            <IconButton style={styles.iconButton} icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />} size={20} onPress={() => navigation.navigate("UpdateWorkExperience", { experienceItem: item })} />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.descriptionText}>{item.company_name}</Text>
                            <Text style={styles.contentText}>{moment(item.date_started).format('MMM YYYY')} - {moment(item.date_ended).format('MMM YYYY')}</Text>
                        </View>
                        <Text style={styles.descriptionText}>{item.salary}</Text>
                        <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>
                        <View>
                            <Text style={{ fontWeight: 'bold', color: 'gray' }}>Contact Person Detail</Text>
                            <Text style={styles.descriptionText}>{item.contact_person}</Text>
                            <Text style={styles.descriptionText}>{item.contact_phone}</Text>
                            <Text style={styles.descriptionText}>{item.contact_position}</Text>
                        </View>
                    </View>
                </View>
            );
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Edit Work Experience" />
            </Appbar.Header>
            <FlatList
                data={user.work_experiences}
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
        padding: 8,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 10,
        elevation: 1,
        // alignItems: 'center',
    },
    imageContainer: {},
    mediaImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
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
    }
});

export default EditWorkExperience;
