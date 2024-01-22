import React from 'react'
import Header from './Header';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

function AuthenticatedLayout({ children, activeBottomNav }) {

    console.log(activeBottomNav);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {activeBottomNav === 'Dashboard' && (
                <>
                    <View style={{ backgroundColor: '#329acc', height: 40 }}></View>
                    <Searchbar style={{ backgroundColor: '#fff', color: '#adadad', marginHorizontal: 20, marginTop: -30 }} placeholder='Search job title / keyword' />
                </>
            )}
            {activeBottomNav === 'Jobs' && (
                <>
                    <View style={{ backgroundColor: '#329acc', height: 40 }}></View>
                    <Searchbar style={{ backgroundColor: '#fff', color: '#adadad', marginHorizontal: 20, marginTop: -30 }} placeholder='Search job title / keyword' />
                </>
            )}

            <ScrollView style={styles.container}>
                <View>
                    {children}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
});
export default AuthenticatedLayout