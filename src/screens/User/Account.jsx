import React from 'react';
import { Divider, IconButton, MD3Colors } from 'react-native-paper';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'
import { useUser } from "../../hooks/useUser";

async function getUser(userData) {
    try {
        const user = await AsyncStorage.getItem('upcare_user');
        const headers = getJWTHeader(user);
        const response = await axiosInstance.get(`/user/user/profile`, userData, { headers });
        return response.data.user;
    } catch (error) {
        throw new Error(error.response.data.message || 'Something went wrong')
    }
}
const Account = () => {
    const navigation = useNavigation();
    const { user } = useUser();
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
                            <FontAwesome5 name="user-circle" size={20} color="#0A3480" style={styles.cardIcon} solid />
                            <Text style={styles.cardTitle}>About Me</Text>
                        </View>
                        <IconButton icon="pencil-box" size={20} selected onPress={() => navigation.navigate('AboutMeScreen')} />
                    </View>

                    <Divider style={{
                        marginTop: 0
                    }} />
                    <Text style={styles.cardDescription}>{user?.about_me}</Text>

                </View>
                {/* End of About Me Card */}

                {/* Skills Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        <View style={styles.cardContent}>
                            <FontAwesome5 name="star" size={18} color="#0A3480" style={styles.cardIcon} solid />
                            <Text style={styles.cardTitle}>Professional Skills</Text>
                        </View>
                        <IconButton icon="pencil-box" size={20} selected onPress={() => { }} />
                    </View>

                    <Divider style={{
                        marginTop: 0
                    }} />
                    <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero eget magna euismod, a facilisis felis sollicitudin.</Text>
                </View>
                {/* End of Sill Card */}

                {/* Education Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        <View style={styles.cardContent}>
                            <FontAwesome5 name="graduation-cap" size={20} color="#0A3480" style={styles.cardIcon} />
                            <Text style={styles.cardTitle}>Education</Text>
                        </View>
                        <IconButton icon="pencil-box" size={20} selected onPress={() => { }} />
                    </View>

                    <Divider style={{
                        marginTop: 0
                    }} />
                    <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero eget magna euismod, a facilisis felis sollicitudin.</Text>
                </View>
                {/* End of Education Card */}

                {/* Education Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        <View style={styles.cardContent}>
                            <FontAwesome5 name="users" size={18} color="#0A3480" style={styles.cardIcon} solid />
                            <Text style={styles.cardTitle}>Seminars and Trainings</Text>
                        </View>
                        <IconButton icon="pencil-box" size={20} selected onPress={() => { }} />
                    </View>

                    <Divider style={{
                        marginTop: 0
                    }} />
                    <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero eget magna euismod, a facilisis felis sollicitudin.</Text>
                </View>
                {/* End of Education Card */}


                {/* Work Experience Card */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                        <View style={styles.cardContent}>
                            <FontAwesome5 name="briefcase" size={18} color="#0A3480" style={styles.cardIcon} />
                            <Text style={styles.cardTitle}>Work Experience</Text>
                        </View>
                        <IconButton icon="pencil-box" size={20} selected onPress={() => { }} />
                    </View>

                    <Divider style={{
                        marginTop: 0
                    }} />
                    <Text style={styles.cardDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero eget magna euismod, a facilisis felis sollicitudin.</Text>
                </View>
                {/* End of Work Experience Card */}

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
        // borderBottomRightRadius: 25,
        // borderBottomLeftRadius: 25,
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
        fontSize: 16,
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
