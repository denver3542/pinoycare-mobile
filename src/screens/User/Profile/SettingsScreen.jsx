import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Text, Button, Portal, Appbar, Card, List, Divider } from 'react-native-paper';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import useAuth from "../../../hooks/useAuth";

const SettingsScreen = ({ navigation }) => {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [logoutVisible, setLogoutVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const { logout, deleteUser } = useAuth();

    const showLogoutModal = () => setLogoutVisible(true);
    const hideLogoutModal = () => setLogoutVisible(false);

    const showDeleteModal = () => setDeleteVisible(true);
    const hideDeleteModal = () => setDeleteVisible(false);


    return (
        <AuthenticatedLayout>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Settings" />
            </Appbar.Header>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <List.Item
                        title="Logout"
                        left={props => <List.Icon {...props} icon="exit-to-app" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={showLogoutModal}
                    />
                    <Divider />
                    <List.Item
                        title="Delete Account"
                        left={props => <List.Icon {...props} icon="delete-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={showDeleteModal}
                    />
                </Card>


                <Portal>
                    <Modal visible={logoutVisible} onDismiss={hideLogoutModal} contentContainerStyle={styles.modal}>
                        <Text style={styles.modalTitle}>Log out</Text>
                        <Text style={styles.modalText}>Are you sure you want to leave?</Text>
                        <Button mode="contained" onPress={logout} style={styles.button}>
                            Yes
                        </Button>
                        <Button onPress={hideLogoutModal} style={styles.button}>
                            Cancel
                        </Button>
                    </Modal>
                </Portal>

                <Portal>
                    <Modal visible={deleteVisible} onDismiss={hideDeleteModal} contentContainerStyle={styles.modal}>
                        <Text style={styles.modalTitle}>Delete Account</Text>
                        <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
                        <Button mode="contained" onPress={deleteUser} style={styles.button}>
                            Yes, Delete
                        </Button>
                        <Button onPress={hideDeleteModal} style={styles.button}>
                            Cancel
                        </Button>
                    </Modal>
                </Portal>
            </View>
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 4,
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20
    },
    button: {
        marginTop: 10,
    },
});

export default SettingsScreen;
