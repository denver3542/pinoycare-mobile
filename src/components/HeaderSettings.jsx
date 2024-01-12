import { FontAwesome5 } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

function HeaderSettings() {
    return (
        <View style={styles.headerContainer}>
            <FontAwesome5 name={'ellipsis-h'} color={'white'} size={20} style={{ marginTop: 5 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingRight: 20,
    },
});

export default HeaderSettings
