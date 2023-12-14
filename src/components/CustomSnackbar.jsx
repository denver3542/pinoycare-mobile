import React from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomSnackbar = ({ visible, onDismiss, message, color }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Snackbar
                visible={visible}
                onDismiss={onDismiss}
                duration={3000}
                style={{ backgroundColor: color }}
            // ... other props
            >
                {message}
            </Snackbar>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'fixed',
        bottom: 50,
        width: '100%',
    },
});

export default CustomSnackbar;
