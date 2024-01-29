import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

function AuthenticatedLayout({ children, activeBottomNav }) {
    const navigation = useNavigation();
    const route = useRoute();

    const isDashboardOrJobs = activeBottomNav === 'Dashboard' || activeBottomNav === 'Jobs';

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isDashboardOrJobs && (
                <View style={styles.searchContainer}>
                    <Searchbar
                        placeholder='Search job title / keyword'
                        onChangeText={(query) => {
                            // Handle search functionality here
                        }}
                        onBlur={() => {
                            // Handle search bar blur event here
                        }}
                        onFocus={() => {
                            // Handle search bar focus event here
                        }}
                        style={styles.searchBar}
                        inputStyle={styles.searchBarInput}
                    />
                </View>
            )}

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
    contentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
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
        backgroundColor: 'white',
    },
    searchBarInput: {
        fontSize: 16,
    },
});

export default AuthenticatedLayout;
