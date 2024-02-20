import { FontAwesome5 } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

function HeaderSettings({ subtitle, title }) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.subtitleStyle}>{subtitle}</Text>
            <Text style={styles.titleStyle}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingLeft: 20,
    },
    subtitleStyle: {
        color: 'white',
        fontSize: 18
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24
    },
});

export default HeaderSettings
