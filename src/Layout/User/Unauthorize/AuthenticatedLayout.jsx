import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

function AuthenticatedLayout({ children, activeBottomNav }) {
    const navigation = useNavigation();
    const route = useRoute();

    return (

        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                {children}
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F7FB",
    },

});

export default AuthenticatedLayout;
