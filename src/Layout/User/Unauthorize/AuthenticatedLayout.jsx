import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

function AuthenticatedLayout({ children, activeBottomNav }) {
    const navigation = useNavigation();
    const route = useRoute();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.contentContainer}>
                    {children}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    searchContainer: {
        marginHorizontal: 20,
        marginVertical: 4,
    },
    searchBar: {
        borderRadius: 50,
        height: 50,
        borderWidth: 0.1,
        elevation: 10,
        backgroundColor: '#FBFBFB',
    },
    searchBarInput: {
        fontSize: 16,
    },
});

export default AuthenticatedLayout;
