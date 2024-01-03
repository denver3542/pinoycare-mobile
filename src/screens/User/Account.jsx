import React from 'react'
import { Text } from 'react-native-paper'
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'
import CustomListItem from '../../components/CustomListItem'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'


const Account = () => {
    return (
        <AuthenticatedLayout>
            <TouchableOpacity style={styles.item}>
                <Text style={styles.title}>asdasd</Text>
                <FontAwesome5 style={styles.icon} name={'arrow-right'} size={20} color="#000" />
            </TouchableOpacity>
        </AuthenticatedLayout>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1, // This adds a bottom border with a height of 1 pixel
        borderBottomColor: '#ddd', // This sets the color of the bottom border; adjust as needed
    },
    title: {
        marginLeft: 5,
        fontSize: 24
    },
    icon: {
        marginRight: 5
    }
})


export default Account