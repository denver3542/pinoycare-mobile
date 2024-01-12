import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'

function HeaderAvatar() {
    return (
        <View style={styles.headerContainer}>
            <Avatar.Image
                size={35}
                source={require('../../assets/images/hero-bg.jpg')}

            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingLeft: 20,
    },
});

export default HeaderAvatar
