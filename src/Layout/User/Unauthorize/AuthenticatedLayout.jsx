import React from 'react'
import Header from './Header';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

function AuthenticatedLayout({ children }) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
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
        paddingVertical: 20,
        paddingHorizontal: 20
    },
});
export default AuthenticatedLayout