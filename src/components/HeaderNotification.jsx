import { FontAwesome5 } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

function HeaderNotification() {
    return (
        <View style={styles.headerContainer}>
            <View style={{ position: 'relative' }}>
                <FontAwesome5 name={'bell'} color={'white'} size={20} style={{ marginTop: 5 }} />
                <Text style={{ height: 8, width: 8, backgroundColor: 'red', borderRadius: 20, position: 'absolute', right: 0, bottom: 12 }}></Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingRight: 20,
    },
});

export default HeaderNotification
