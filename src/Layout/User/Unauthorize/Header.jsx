import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

function Header() {
    const navigation = useNavigation()
    return (
        <View style={styles.logoContainer}>
            <Button
                mode="text"
                icon="arrow-left-thick"
                labelStyle={styles.logo}
                compact={true}
                onPress={() => navigation.goBack()}
            ></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 50,
    },
    logo: {
        fontSize: 20,
    },
});


export default Header


