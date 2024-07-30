import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Appbar } from "react-native-paper";

const SearchJob = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            </Appbar.Header>

            <View style={styles.contentContainer}>
                <Text>TEST</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        padding: 8,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center'
    }
});

export default SearchJob;