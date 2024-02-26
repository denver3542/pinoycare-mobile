import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { Card, Chip, Divider, List } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout';
import { useUser } from "../../hooks/useUser";
import { useProfile } from '../../hooks/useProfile.js';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

function Account(activeNav) {
    const { user, isFetching, isFetched, setIsFetched } = useUser();
    const { profile, isFetching: isProfileFetching, isFetched: isProfileFetched, setIsFetched: setProfileIsFetched } = useProfile(user.token);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeBottomNav = activeNav.route.name;
    const [loading, setLoading] = useState(true);
    const windowHeight = Dimensions.get("screen").height;
    const [error, setError] = useState(null);
    const Tab = createMaterialTopTabNavigator();

    // Define handleEditPress function
    const handleEditPress = () => {
        // Your edit logic goes here
        console.log('Edit button pressed');
    };


    useEffect(() => {
        if (isProfileFetched && isFetched) {
            console.log('Profile Data in Account Component:', profile);
        }
    }, [isProfileFetched, isFetched]);

    const workExperienceData = [
        { id: '1', title: 'Work Experience 1' },
        { id: '2', title: 'Work Experience 2' },
        { id: '3', title: 'Work Experience 3' },
        // Add more data as needed
    ];
    return (
        <AuthenticatedLayout activeBottomNav={activeBottomNav}>
            <ScrollView>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userInfoText}>
                                <Text style={styles.headerName}>{user?.name || 'N/A'}</Text>
                                <Text style={styles.headerProfession}>{user?.profession || 'N/A'}</Text>
                                <View style={[styles.statusContainer,]}>
                                    <Text style={[styles.statusText, { color: user?.status === 'approved' ? 'green' : user?.status === 'pending' ? 'orange' : 'red' }]}>
                                        {user?.status === 'approved' ? 'VERIFIED' : user?.status === 'pending' ? 'NOT VERIFIED' : user?.status ? user.status.toUpperCase() : 'N/A'}
                                    </Text>
                                    {user?.status === 'approved' ? (
                                        <FontAwesome5 name="user-check" size={10} color="green" style={styles.statusIcon} />
                                    ) : user?.status === 'pending' ? (
                                        <FontAwesome5 name="clock" size={10} color="orange" style={styles.statusIcon} />
                                    ) : (
                                        <FontAwesome5 name="times" size={10} color="red" style={styles.statusIcon} />
                                    )}
                                </View>


                                <View style={styles.emailContainer}>
                                    <FontAwesome5 name="envelope" size={14} color="white" />
                                    <Text style={styles.emailText}>{user?.email || 'N/A'}</Text>
                                </View>

                                <View style={styles.phoneContainer}>
                                    <FontAwesome5 name="phone-alt" size={14} color="white" />
                                    <Text style={styles.phoneText}>{user?.phone || 'N/A'}</Text>
                                </View>
                                <View style={styles.addressContainer}>
                                    <FontAwesome5 name="map-marker-alt" size={14} color="white" />
                                    <Text style={styles.addressText}>{user?.current_address || 'N/A'}</Text>
                                </View>
                            </View>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={profile?.profile_picture ? { uri: profile.profile_picture } : require('../../../assets/images/sample-profile.jpg')}
                                    style={styles.profileImage}
                                />
                                <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
                                    <View style={styles.editContent}>
                                        <Text style={styles.editText}>Edit</Text>
                                        <FontAwesome5 name="edit" size={14} color="white" style={styles.editIcon} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <Card style={{ borderRadius: 0, margin: 0, backgroundColor: "white" }}>
                        <Card.Content>
                            <View style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text variant="titleLarge" style={{ fontSize: 18 }}>Professional Skills</Text>
                                    <TouchableOpacity>
                                        <FontAwesome5 name="plus-square" size={18} color="#001C4E" solid />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 12 }}>
                                    <Chip
                                        icon={({ color }) => <FontAwesome5 name="times-circle" size={16} color={color} solid />}
                                        onPress={() => console.log('Pressed')}
                                        mode="outlined"
                                        style={{ borderRadius: 20, justifyContent: 'center', borderColor: 'gray', borderWidth: 0.6, marginRight: 4 }}
                                    >
                                        Test
                                    </Chip>
                                </View>

                            </View>
                            <Divider />
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text variant="titleLarge" style={{ fontSize: 18 }}>Educational Background</Text>
                                    <TouchableOpacity>
                                        <FontAwesome5 name="edit" size={16} color="#001C4E" solid />
                                    </TouchableOpacity>
                                </View>
                                <List.Item title="Elementary" description="Butuan Central Elementary School" titleStyle={{ fontSize: 16, marginBottom: 2, color: "#7F8487" }} descriptionStyle={{ fontWeight: "bold", fontSize: 14 }}>
                                </List.Item>
                                <List.Item title="Junior High School" description="Agusan National High School" titleStyle={{ fontSize: 16, marginBottom: 2, color: "#7F8487" }} descriptionStyle={{ fontWeight: "bold", fontSize: 14 }}>
                                </List.Item>
                                <List.Item title="Senior High School" description="Father Saturnino Urios University" titleStyle={{ fontSize: 16, marginBottom: 2, color: "#7F8487" }} descriptionStyle={{ fontWeight: "bold", fontSize: 14 }}>
                                </List.Item>
                                <List.Item title="Master" description="None" titleStyle={{ fontSize: 16, marginBottom: 2, color: "#7F8487" }} descriptionStyle={{ fontWeight: "bold", fontSize: 14 }}>
                                </List.Item>
                                <List.Item title="Doctorate" description="None" titleStyle={{ fontSize: 16, marginBottom: 2, color: "#7F8487" }} descriptionStyle={{ fontWeight: "bold", fontSize: 14 }}>
                                </List.Item>
                            </View>
                            <Divider />
                            <View style={{ marginTop: 20, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text variant="titleLarge" style={{ fontSize: 18 }}>Seminars and Trainings</Text>
                                    <TouchableOpacity>
                                        <FontAwesome5 name="edit" size={16} color="#001C4E" solid />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 20, marginLeft: 12, }}>
                                    <Text style={{ marginBottom: 2, color: '#7F8487', fontSize: 16 }}>Coach Mabs</Text>
                                    <Text style={{ textAlign: 'justify', fontSize: 14 }}>It takes hardwork. It takes dedication. It takes SICKENING CONSISTENCY, day in and day out. The same thing over and over and over again.</Text>
                                </View>
                                <View style={{ marginTop: 20, marginLeft: 12, }}>
                                    <Text style={{ marginBottom: 2, color: '#7F8487', fontSize: 16 }}>Coach Mavs</Text>
                                    <Text style={{ textAlign: 'justify', fontSize: 14 }}>It takes hardwork. It takes dedication. It takes SICKENING CONSISTENCY, day in and day out. The same thing over and over and over again.</Text>
                                </View>
                            </View>
                            <Divider />
                            <View style={{ marginTop: 20, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text variant="titleLarge" style={{ fontSize: 18 }}>Work Experience</Text>
                                    <TouchableOpacity>
                                        <FontAwesome5 name="edit" size={16} color="#001C4E" solid />
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={workExperienceData}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <View style={styles.card}>
                                            <Text style={styles.cardText}>{item.title}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </Card.Content>
                    </Card>
                    {/* {user && (<Tab.Navigator></Tab.Navigator>)} */}
                </SafeAreaView>
            </ScrollView>
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({

    header: {
        backgroundColor: '#001234',
        height: 200,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30
    },
    userInfoText: {
        flex: 1,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    imageContainer: {
        alignItems: 'center',
    },
    headerName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerProfession: {
        color: 'gray',
        fontSize: 14,
        marginBottom: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 2,
        marginBottom: 10,
    },
    statusText: {
        color: 'white',
        marginRight: 5,
    },
    statusIcon: {
        marginLeft: 5,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emailText: {
        color: 'white',
        marginLeft: 5,
    },
    phoneText: {
        color: 'white',
        marginLeft: 5,
    },
    addressText: {
        color: 'white',
        marginLeft: 5,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    editContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editText: {
        color: 'white',
    },
    editButton: {
        marginTop: 10,
    },
    outlinedChip: {
        borderWidth: 1,
        borderColor: '#001C4E',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    outlinedChipText: {
        color: '#001C4E',
        fontSize: 16,
    },


});

export default Account;
