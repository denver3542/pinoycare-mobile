import React from 'react';
import { Divider, IconButton, MD3Colors } from 'react-native-paper';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'

const Account = () => {
    return (
        <AuthenticatedLayout>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.location}>California, USA</Text>
                    <View style={styles.stats}>
                        <Text style={styles.followers}>120K Followers</Text>
                        <Text style={styles.following}>23K Following</Text>
                    </View>
                    <TouchableOpacity style={styles.editProfileButton}>
                        <Text style={styles.editProfileText}>Edit profile</Text>
                    </TouchableOpacity>
                </View>
                {/* About Me Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        <View style={styles.cardContent}>
                            <FontAwesome5 name="user" size={20} color="#0A3480" style={styles.cardIcon} solid />
                            <Text style={styles.cardTitle}>About me</Text>
                        </View>
                        <IconButton icon="pen" size={24} selected onPress={() => { }} />
                    </View>

                    <Divider style={{
                        marginTop: 15
                    }} />
                    <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero eget magna euismod, a facilisis felis sollicitudin.</Text>
                </View>
                {/* End of About Me Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        <View style={styles.cardContent}>
                            <FontAwesome5 name="briefcase" size={20} color="#0A3480" style={styles.cardIcon} />
                            <Text style={styles.cardTitle}>Work Experiences</Text>
                        </View>
                        <IconButton icon="pen" size={24} selected onPress={() => { }} />
                    </View>

                    <Divider style={{
                        marginTop: 15
                    }} />
                    <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero eget magna euismod, a facilisis felis sollicitudin.</Text>
                </View>
                <View style={styles.section}>
                    <FontAwesome5 name="graduation-cap" size={24} color="#0A3480" />
                    <Text style={styles.sectionText}>Education</Text>
                </View>
                <View style={styles.section}>
                    <AntDesign name="staro" size={24} color="#0A3480" />
                    <Text style={styles.sectionText}>Skill</Text>
                </View>
                <View style={styles.section}>
                    <AntDesign name="earth" size={24} color="#0A3480" />
                    <Text style={styles.sectionText}>Language</Text>
                </View>
                <View style={styles.section}>
                    <FontAwesome5 name="heart" size={24} color="#0A3480" />
                    <Text style={styles.sectionText}>Appreciation</Text>
                </View>
            </ScrollView>
        </AuthenticatedLayout>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10
    },
    header: {
        backgroundColor: '#0A3480',
        padding: 20,
        // borderBottomRightRadius: 30,
        // borderBottomLeftRadius: 30,
        // borderTopRightRadius: 30,
        // borderTopLeftRadius: 30,
        // marginVertical: 15,
        // marginHorizontal: 5,
        justifyContent: "center",
        height: 200,
    },
    location: {
        color: 'white',
        fontWeight: 'bold',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    followers: {
        color: 'white',
    },
    following: {
        color: 'white',
    },
    editProfileButton: {
        marginTop: 10,
    },
    editProfileText: {
        color: 'white',
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        elevation: 1,
        borderRadius: 14
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        marginRight: 10,
    },
    cardTitle: {
        color: '#0A3480',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDescription: {
        marginTop: 10,
        color: '#333',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionText: {
        marginLeft: 10,
    },
});

export default Account;
