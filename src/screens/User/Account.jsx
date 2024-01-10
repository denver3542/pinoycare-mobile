import React from 'react'
import { Avatar, Text } from 'react-native-paper'
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'
import CustomListItem from '../../components/CustomListItem'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
import { useUser } from '../../hooks/useUser'


const Account = () => {
    const { user } = useUser()
    console.log(user);
    return (
        <AuthenticatedLayout>
            <TouchableOpacity style={styles.header}>
                {/* <Avatar.Image size={40} source={require('../../../assets/icon.png')} style={{ marginLeft: 12 }} /> */}
                <Text style={styles.title}>Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '100%' }}>
                <View style={styles.item}>
                    <Text style={styles.item_title}>Logout</Text>
                </View>
            </TouchableOpacity>

        </AuthenticatedLayout>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 2, // This adds a bottom border with a height of 1 pixel
        borderBottomColor: '#ddd', // This sets the color of the bottom border; adjust as needed
    },
    item: {
        flexDirection: "row",
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1, // This adds a bottom border with a height of 1 pixel
        marginHorizontal: 10,
        borderBottomColor: '#ddd', // This sets the color of the bottom border; adjust as needed
    },
    title: {
        marginLeft: 5,
        fontSize: 20
    },
    item_title: {
        marginLeft: 5,
        fontSize: 16
    },
    icon: {
        marginRight: 5
    }
})


export default Account