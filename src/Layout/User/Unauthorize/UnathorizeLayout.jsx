import React from 'react'
import Header from './Header';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

function UnathorizeLayout({ children }) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Header />
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
        paddingHorizontal: 24,
    },
});
export default UnathorizeLayout