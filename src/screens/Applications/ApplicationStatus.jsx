import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Appbar, Button, Card, Chip, Divider, Modal, Title, useTheme, Portal } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";

const ApplicationStatus = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const application = params?.job || {};

    return (
        <View>
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Application Stage" titleStyle={{ color: 'white' }} />
            </Appbar.Header>
            <Text>{application.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ApplicationStatus;
