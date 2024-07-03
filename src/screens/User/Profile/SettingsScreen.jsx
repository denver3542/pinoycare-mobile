import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Modal, Text, Button, Portal, Appbar, Card, List, Divider } from 'react-native-paper';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import { useAuth } from "../../../hooks/useAuth";
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const SettingsScreen = ({ navigation }) => {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [logoutVisible, setLogoutVisible] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [showError, setShowError] = useState(false);

    const { logout, deleteUser } = useAuth();

    const showLogoutModal = () => setLogoutVisible(true);
    const hideLogoutModal = () => setLogoutVisible(false);

    const deleteBottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '30%'], []);
    const deleteSnapPoints = useMemo(() => ['25%', '35%'], []);
    const handleCloseDeleteBottomSheet = () => deleteBottomSheetRef.current?.close();
    const handleOpenDeleteBottomSheet = () => {
        setDeleteConfirmation(false);
        setShowError(false);
        deleteBottomSheetRef.current?.expand();
    };
    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const handleDeleteInputChange = (text) => {
        setDeleteInput(text.trim());
    };

    const handleSubmitDelete = () => {
        Keyboard.dismiss();
        if (deleteInput.toLowerCase() === 'delete') {
            deleteUser();
            handleCloseDeleteBottomSheet();
        } else {
            setShowError(true);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                    <Appbar.Content title="Settings" titleStyle={{ color: 'white' }} />
                </Appbar.Header>
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <List.Item
                            title="Edit Profile"
                            left={props => <List.Icon {...props} icon="account" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => navigation.navigate("EditUserProfileScreen")}
                        />
                        <Divider />
                        <List.Item
                            title="Logout"
                            left={props => <List.Icon {...props} icon="exit-to-app" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={showLogoutModal}
                        />
                        <Divider />
                        <List.Item
                            title="Delete Account"
                            left={props => <List.Icon {...props} icon="delete" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                            onPress={handleOpenDeleteBottomSheet}
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
                </View>
                <BottomSheet
                    ref={deleteBottomSheetRef}
                    index={-1}
                    snapPoints={deleteSnapPoints}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                >
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Delete Account</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type 'Delete' to confirm"
                            placeholderTextColor="#999"
                            onChangeText={handleDeleteInputChange}
                            value={deleteInput}
                            autoCapitalize="none"
                            blurOnSubmit={true}
                            onSubmitEditing={handleSubmitDelete}
                        />
                        {showError && (
                            <Text style={styles.errorText}>Incorrect input. Please type 'Delete' to confirm.</Text>
                        )}
                        <Button mode="contained" onPress={handleSubmitDelete} style={styles.button}>
                            Delete
                        </Button>
                        <Button onPress={handleCloseDeleteBottomSheet} style={styles.button}>
                            Cancel
                        </Button>
                    </View>
                </BottomSheet>
            </View>
        </TouchableWithoutFeedback>
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
    bottomSheetContent: { paddingHorizontal: 20, paddingVertical: 15 },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default SettingsScreen;
