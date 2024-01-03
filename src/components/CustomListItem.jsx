import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, TouchableOpacity } from 'react-native-paper';

const CustomListItem = ({ iconName, title }) => {
    return (
        <TouchableOpacity style={styles.item}>
            <FontAwesome5 name={'home'} size={24} color="#000" />
            <Text style={styles.title}>asdasd</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        padding: 20,
        alignItems: 'ceneter'
    },
    title: {
        marginLeft: 20
    }
})

export default CustomListItem

