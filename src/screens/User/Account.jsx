import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomListItem from '../../components/CustomListItem';
import { StyleSheet, Image, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '../../hooks/useUser';

function Account(activeNav) {
    const { user, isFetching, isFetched } = useUser();
    const [activeIndex, setActiveIndex] = useState(0);
    const activeBottomNav = activeNav.route.name;
    const profileImagePath = user && user.profile_picture ? { uri: user.profile_picture } : require('../../../assets/images/sample-profile.jpg');
    return (
        <AuthenticatedLayout activeBottomNav={activeBottomNav}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <View style={styles.userInfoContainer}>
                        <Image source={profileImagePath} style={styles.profileImage} />
                        <View style={styles.userInfoText}>
                            <Text style={styles.headerName}>{user.name || "N/A"}</Text>
                            <Text style={styles.headerProfession}>{user.profession || "N/A"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </AuthenticatedLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: '#001234',
        height: 200,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    headerName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerProfession: {
        color: 'gray',
        fontSize: 14,
    },
    userInfoText: {
        flexDirection: 'column',
    },
});

export default Account;
