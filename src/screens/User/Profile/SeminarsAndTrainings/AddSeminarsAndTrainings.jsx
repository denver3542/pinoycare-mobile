import React, { useState, useRef, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Appbar, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../../hooks/useUser';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
import { useSeminarsAndTrainings } from './hooks/useSeminarsActions';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';

const SeminarsAndTrainingsForm = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const { mutate, isLoading, isError, error } = useSeminarsAndTrainings();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateFieldName, setDateFieldName] = useState(null);
    const [certificateUri, setCertificateUri] = useState(null);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            facilitated_by: user?.training?.facilitated_by || '',
            description: user?.training?.description || '',
            date_started: user?.training?.date_started ? new Date(user?.training?.date_started) : new Date(),
            date_completed: user?.training?.date_completed ? new Date(user?.training?.date_completed) : new Date(),
            certificate: null,
        },
    });

    const handleConfirm = (selectedDate) => {
        setDatePickerVisibility(false);
        setValue(dateFieldName, selectedDate);
    };

    const showDatePicker = (fieldName) => {
        setDateFieldName(fieldName);
        setDatePickerVisibility(true);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setValue('certificate', result.assets[0].uri);
            setCertificateUri(result.assets[0].uri);
        }
    };

    const onSubmit = handleSubmit((data) => {
        const formData = new FormData();
        formData.append('trainings[0][facilitated_by]', data.facilitated_by);
        formData.append('trainings[0][description]', data.description);
        formData.append('trainings[0][date_started]', data.date_started.toISOString().slice(0, 10));
        formData.append('trainings[0][date_completed]', data.date_completed.toISOString().slice(0, 10));
        if (data.certificate) {
            const file = {
                uri: data.certificate,
                type: 'image/jpeg',
                name: 'certificate.jpg'
            };
            formData.append('trainings[0][certificates]', file);
        }

        mutate(formData);
    });

    const saveBottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%'], []);
    const handleCloseSaveBottomSheet = () => saveBottomSheetRef.current?.close();
    const handleOpenSaveBottomSheet = () => {
        Keyboard.dismiss();
        setTimeout(() => saveBottomSheetRef.current?.expand(), 50);
    };
    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const handleInputFocus = () => {
        if (saveBottomSheetRef.current) {
            saveBottomSheetRef.current.close();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                    <Appbar.Content title="Add Seminars And Trainings" titleStyle={{ color: 'white' }} />
                </Appbar.Header>

                <ScrollView style={styles.container}>
                    <Spinner
                        visible={isLoading}
                    />
                    <CustomTextInput
                        control={control}
                        name="facilitated_by"
                        label="Facilitated By"
                        mode="outlined"
                        style={styles.input}
                        rules={{ required: 'Facilitator Name is required' }}
                        error={errors.facilitated_by}
                    />

                    <CustomTextInput
                        control={control}
                        name="description"
                        label="Description"
                        mode="outlined"
                        style={styles.input}
                        rules={{ required: 'Description is required' }}
                        error={errors.description}
                    />

                    {/* Date Started Picker */}
                    <View style={styles.datePickerContainer}>
                        <TouchableOpacity onPress={() => showDatePicker('date_started')}>
                            <CustomTextInput
                                control={control}
                                label="Date Started"
                                mode="outlined"
                                name="date_started"
                                value={watch('date_started').toLocaleDateString()}
                                rules={{ required: 'Date Started is required' }}
                                editable={false}
                                onPress={() => showDatePicker('date_started')}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Date Completed Picker */}
                    <View style={styles.datePickerContainer}>
                        <TouchableOpacity onPress={() => showDatePicker('date_started')}>
                            <CustomTextInput
                                control={control}
                                label="Date Completed"
                                mode="outlined"
                                name="date_completed"
                                value={watch('date_completed').toLocaleDateString()}
                                rules={{ required: 'Date Completed is required' }}
                                editable={false}
                                onPress={() => showDatePicker('date_completed')}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker Modal */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                    />

                    {/* Certificate Picker */}
                    <TouchableRipple style={styles.touchable} onPress={pickImage}>
                        {watch('certificate') ? (
                            <Image source={{ uri: watch('certificate') }} style={styles.image} />
                        ) : (
                            <Text style={styles.text}>Tap to upload certificate image</Text>
                        )}
                    </TouchableRipple>

                    {/* Save Button */}
                    <Button mode="contained" onPress={handleOpenSaveBottomSheet} style={styles.saveButton}>
                        Save
                    </Button>

                    {isError && <Text>Error: {error.message}</Text>}
                </ScrollView>
                <BottomSheet
                    ref={saveBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                >
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Confirm Save</Text>
                        <Text>Are you sure you want to save these changes?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableWithoutFeedback onPress={handleSubmit(onSubmit)}>
                                <View style={[styles.button, styles.yesButton]}>
                                    <Text style={styles.buttonText}>Save Changes</Text>
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={handleCloseSaveBottomSheet}>
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
        padding: 10,
    },
    input: {
        marginBottom: 10,
    },
    datePickerContainer: {
        marginBottom: 10,
    },
    touchable: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: '100%',
        borderRadius: 8,
        marginBottom: 16,
        borderColor: 'black',
        borderWidth: 0.8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
    },
    saveButton: {
        marginBottom: 10,
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

export default SeminarsAndTrainingsForm;
