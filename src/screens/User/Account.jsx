import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { Card, Chip, Divider, List, Title, Paragraph, useTheme, colors } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout';
import { useUser } from "../../hooks/useUser";
import { useProfile } from '../../hooks/useProfile.js';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CustomAddSkillModal from '../../components/CustomAddSkillModal';
import CustomEditEducationalBackground from '../../components/CustomEditEducationalBackground';
import CustomEditSeminarsAndTranings from '../../components/CustomEditSeminarsAndTranings';

function Account(activeNav) {
    const { user, isFetching, isFetched, setIsFetched } = useUser();
    const { profile, isFetching: isProfileFetching, isFetched: isProfileFetched, setIsFetched: setProfileIsFetched } = useProfile(user.token);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeBottomNav = activeNav.route.name;
    const [loading, setLoading] = useState(true);
    const windowHeight = Dimensions.get("screen").height;
    const [error, setError] = useState(null);
    const Tab = createMaterialTopTabNavigator();
    const theme = useTheme();
    const [showAddSkillModal, setShowAddSkillModal] = useState(false);
    const [showEditEducationalBackgroundModal, setShowEditEducationalBackgroundModal] = useState(false);
    const [showEditSeminarsAndTraningModal, setshowEditSeminarsAndTraningModal] = useState(false);


    const toggleAddSkillModal = () => {
        setShowAddSkillModal(!showAddSkillModal);
    };

    const toggleEditEducationalBackgroundModal = () => {
        setShowEditEducationalBackgroundModal(!showEditEducationalBackgroundModal);
    };

    const toggleshowEditSeminarsAndTraningModal = () => {
        setshowEditSeminarsAndTraningModal(!showEditSeminarsAndTraningModal);
    };

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
        {
            id: '1',
            title: 'Software Engineer',
            position: 'Fullstack Developer',
            dateFrom: '2022-01-01',
            dateTo: '2023-01-01',
            salary: '$5000'
        },
        {
            id: '2',
            title: 'Frontend Developer',
            position: 'Junior Developer',
            dateFrom: '2023-02-01',
            dateTo: '2024-02-01',
            salary: '$6000'
        },
    ];
    return (
        <AuthenticatedLayout activeBottomNav={activeBottomNav}>
            <ScrollView>
                <>
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

                    <Card style={{ backgroundColor: '#FFFFFF', borderRadius: 0 }}>
                        <Card.Content>
                            <View style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text variant="titleLarge" style={{ fontSize: 20, fontWeight: 'bold' }}>Professional Skills</Text>
                                    <TouchableOpacity onPress={toggleAddSkillModal}>
                                        <FontAwesome5 name="plus-square" size={20} color="#0A3480" solid />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 12 }}>
                                    <Chip
                                        icon={({ color }) => <FontAwesome5 name="times-circle" size={16} color="#0A3480" solid />}
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
                                    <Text variant="titleLarge" style={{ fontSize: 20, fontWeight: 'bold' }}>Educational Background</Text>
                                    <TouchableOpacity onPress={toggleEditEducationalBackgroundModal}>
                                        <FontAwesome5 name="pen-square" size={20} color="#0A3480" solid />
                                    </TouchableOpacity>
                                </View>
                                <List.Item title="Elementary" description="Butuan Central Elementary School" titleStyle={{ fontSize: 18, color: "#7F8487" }} descriptionStyle={{ fontSize: 16 }}>
                                </List.Item>
                                <List.Item title="Junior High School" description="Agusan National High School" titleStyle={{ fontSize: 18, color: "#7F8487" }} descriptionStyle={{ fontSize: 16 }}>
                                </List.Item>
                                <List.Item title="Senior High School" description="Father Saturnino Urios University" titleStyle={{ fontSize: 18, color: "#7F8487" }} descriptionStyle={{ fontSize: 16 }}>
                                </List.Item>
                                <List.Item title="Master" description="None" titleStyle={{ fontSize: 18, color: "#7F8487" }} descriptionStyle={{ fontSize: 16 }}>
                                </List.Item>
                                <List.Item title="Doctorate" description="None" titleStyle={{ fontSize: 18, color: "#7F8487" }} descriptionStyle={{ fontSize: 16 }}>
                                </List.Item>
                            </View>
                            <Divider />
                            <View style={{ marginTop: 20, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text variant="titleLarge" style={{ fontSize: 20, fontWeight: 'bold' }}>Seminars and Trainings</Text>
                                    <TouchableOpacity onPress={toggleshowEditSeminarsAndTraningModal}>
                                        <FontAwesome5 name="pen-square" size={20} color="#0A3480" solid />
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
                                    <Text variant="titleLarge" style={{ fontSize: 20, fontWeight: 'bold' }}>Work Experience</Text>
                                    <TouchableOpacity>
                                        <FontAwesome5 name="pen-square" size={20} color="#0A3480" solid />
                                    </TouchableOpacity>
                                </View>

                                {workExperienceData.map((item) => (
                                    <View key={item.id} style={{ marginTop: 20 }}>
                                        <Card.Content>
                                            <View style={styles.row}>
                                                <Text style={styles.title}>{item.title}</Text>
                                            </View>
                                            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                                <View>
                                                    <Text style={styles.label}>Position:</Text>
                                                    <Text>{item.position}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.label}>Date Started  Date Ended</Text>
                                                    <Text>{item.dateFrom}  {item.dateTo}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <Text style={styles.label}>Salary:</Text>
                                                <Text>{item.salary}</Text>
                                            </View>
                                        </Card.Content>
                                    </View>
                                ))}
                            </View>
                        </Card.Content>
                    </Card>
                </>
            </ScrollView>
            <CustomAddSkillModal visible={showAddSkillModal} onClose={toggleAddSkillModal} onSave={(a) => console.log('Saving skill:', a)} />
            <CustomEditEducationalBackground visible={showEditEducationalBackgroundModal} onClose={toggleEditEducationalBackgroundModal} onSave={(b) => console.log('Show Edit Educational :', b)} />
            <CustomEditSeminarsAndTranings visible={showEditSeminarsAndTraningModal} onClose={toggleshowEditSeminarsAndTraningModal} onSave={(c) => console.log('Show Edit Seminars and Trainings :', c)} />
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#0A3480',
        height: 200,
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'center',
        // alignItems: 'center'
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30
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
    // card: {
    //     backgroundColor: 'white',
    //     borderRadius: 15,
    //     justifyContent: 'center',
    //     paddingVertical: 15,
    //     marginTop: 10,
    //     elevation: 0.5
    // },
    row: {

        flexDirection: 'row',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        color: '#7F8487',
        fontWeight: 'bold',
    },
    label: {
        fontWeight: 'normal',
        marginRight: 5,
        fontWeight: 'bold'
    },

});

export default Account;
