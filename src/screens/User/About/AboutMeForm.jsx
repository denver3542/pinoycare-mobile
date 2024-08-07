import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from '../../../../utils/axiosConfig';
import CustomTextInput from '../../../components/CustomTextInput';
import { useUser } from '../../../hooks/useUser';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const AboutMeScreen = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            about_me: user?.about_me || '',
        },
    });

    const updateAboutMe = async (dataToUpdate) => {
        try {
            setIsLoading(true);
            const user = JSON.parse(await AsyncStorage.getItem('upcare_user'));
            const headers = getJWTHeader(user);
            const { data } = await axiosInstance.put(`/user/profile/update-about`, dataToUpdate, { headers });
            const updatedUser = { ...user, ...dataToUpdate };
            queryClient.setQueryData(['user'], updatedUser);
            await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
            console.log('About Me update successful:', data);
            navigation.goBack();
            return data;
        } catch (error) {
            console.error('Error updating about me:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const updateBottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%'], []);
    const handleCloseUpdateBottomSheet = () => { updateBottomSheetRef.current?.close(); };
    const handleOpenUpdateBottomSheet = () => {
        Keyboard.dismiss();
        setTimeout(() => updateBottomSheetRef.current?.expand());
    };
    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const onSubmit = async (data) => {
        await updateAboutMe(data);
        handleCloseUpdateBottomSheet();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                    <Appbar.Content title="Update About" titleStyle={{ color: 'white' }} />
                </Appbar.Header>
                <View style={styles.contentContainer}>
                    <View style={styles.formContainer}>
                        <CustomTextInput
                            mode="outlined"
                            control={control}
                            multiline
                            numberOfLines={15}
                            name="about_me"
                            placeholder="Tell me about yourself"
                            label='About Me'
                        />
                        <Button
                            mode="contained"
                            onPress={handleOpenUpdateBottomSheet}
                            labelStyle={{ color: 'white' }}
                        >
                            Update
                        </Button>
                    </View>
                    <Spinner visible={isLoading} />
                </View>
                <BottomSheet
                    ref={updateBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                >
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Confirm Update</Text>
                        <Text>Are you sure you want to update your information?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableWithoutFeedback onPress={handleSubmit(onSubmit)}>
                                <View style={[styles.button, styles.yesButton]}>
                                    <Text style={styles.buttonText}>Yes, Update</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={handleCloseUpdateBottomSheet}>
                                <View style={[styles.button, styles.cancelButton]}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },
    contentContainer: {
        flex: 1,
        padding: 15,
        marginTop: 25,
    },
    formContainer: {
        marginBottom: 15,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bottomSheetContent: {
        padding: 20,
        flex: 1
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        paddingVertical: 10,
    },
    yesButton: {
        backgroundColor: '#0A3480',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#0A3480',
    },
    cancelButtonText: {
        color: '#0A3480',
        fontWeight: 'bold'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AboutMeScreen;
