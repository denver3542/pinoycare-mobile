import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Button, Divider } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useWorkExperience } from './hooks/useWorkExperience';
import { useUser } from '../../../../hooks/useUser';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';

const AddWorkExperience = () => {
    const navigation = useNavigation();
    const { user } = useUser();
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            experiences: [{
                company_name: user?.company_name || '',
                position: user?.position || '',
                date_started: user?.date_started || '',
                date_ended: user?.date_ended || '',
                salary: user?.salary || '',
                contact_person: user?.contact_person || '',
                contact_phone: user?.contact_phone || '',
                contact_position: user?.contact_position || '',
            }],
        },
    });

    const { mutate, isLoading } = useWorkExperience();
    const [dateStartedValue, setDateStartedValue] = useState(new Date());
    const [dateEndedValue, setDateEndedValue] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    useEffect(() => {
        const dateStarted = watch('experiences[0].date_started');
        const dateEnded = watch('experiences[0].date_ended');
        if (dateStarted) setDateStartedValue(new Date(dateStarted));
        if (dateEnded) setDateEndedValue(new Date(dateEnded));
    }, []);

    const handleDateChange = (selectedDate) => {
        setShowDatePicker(false);
        if (selectedDateField && selectedDate) {
            setValue(selectedDateField, moment(selectedDate).format('YYYY-MM-DD'));
            if (selectedDateField === 'experiences[0].date_started') {
                setDateStartedValue(selectedDate);
            } else if (selectedDateField === 'experiences[0].date_ended') {
                setDateEndedValue(selectedDate);
            }
        }
    };

    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setShowDatePicker(true);
    };

    const validateDates = (data) => {
        const dateStarted = new Date(data.experiences[0].date_started);
        const dateEnded = new Date(data.experiences[0].date_ended);

        if (dateStarted > dateEnded) {
            return false;
        }
        return true;
    };

    const onSave = handleSubmit((data) => {
        if (validateDates(data)) {
            mutate(data);
        } else {
            // Show an error message
            alert('The end date must be the same as or after the start date.');
        }
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={navigation.goBack} color='white' />
                    <Appbar.Content title="Add Work Experience" titleStyle={{ color: 'white' }} />
                </Appbar.Header>
                <ScrollView style={styles.container}>
                    <Spinner
                        visible={isLoading}
                    />
                    <View style={{ padding: 8 }}>
                        <CustomTextInput
                            control={control}
                            label="Company Name"
                            mode="outlined"
                            name="experiences[0].company_name"
                            rules={{ required: 'Company Name is required' }}
                            error={errors.experiences && errors.experiences[0]?.company_name}
                            onFocus={handleInputFocus}
                        />

                        <CustomTextInput
                            control={control}
                            label="Position"
                            mode="outlined"
                            name="experiences[0].position"
                            rules={{ required: 'Position is required' }}
                            error={errors.experiences && errors.experiences[0]?.position}
                            onFocus={handleInputFocus}
                        />

                        <TouchableOpacity
                            style={styles.dateContainer}
                            onPress={() => showDatePickerForField('experiences[0].date_started')}
                        >
                            <CustomTextInput
                                control={control}
                                label="Date Started"
                                mode="outlined"
                                name="experiences[0].date_started"
                                rules={{ required: 'Start Date is required' }}
                                error={errors.experiences && errors.experiences[0]?.date_started}
                                editable={false}
                                value={moment(dateStartedValue).format('YYYY-MM-DD')}
                                onPress={() => showDatePickerForField('experiences[0].date_started')}
                                onFocus={handleInputFocus}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => showDatePickerForField('experiences[0].date_ended')}
                        >
                            <CustomTextInput
                                control={control}
                                label="Date Ended"
                                mode="outlined"
                                name="experiences[0].date_ended"
                                rules={{ required: 'End Date is required' }}
                                error={errors.experiences && errors.experiences[0]?.date_ended}
                                editable={false}
                                value={moment(dateEndedValue).format('YYYY-MM-DD')}
                                onPress={() => showDatePickerForField('experiences[0].date_ended')}
                                onFocus={handleInputFocus}
                            />
                        </TouchableOpacity>

                        <CustomTextInput
                            control={control}
                            label="Salary"
                            mode="outlined"
                            name="experiences[0].salary"
                            rules={{ required: 'Salary is required' }}
                            error={errors.experiences && errors.experiences[0]?.salary}
                            onFocus={handleInputFocus}
                        />

                        <Divider style={styles.divider} />

                        <Text style={styles.text}>Contact Person Details</Text>

                        <CustomTextInput
                            control={control}
                            label="Contact Person"
                            mode="outlined"
                            name="experiences[0].contact_person"
                            rules={{ required: 'Contact Person is required' }}
                            error={errors.experiences && errors.experiences[0]?.contact_person}
                            onFocus={handleInputFocus}
                        />

                        <CustomTextInput
                            control={control}
                            label="Contact Phone"
                            mode="outlined"
                            name="experiences[0].contact_phone"
                            rules={{ required: 'Contact Phone is required' }}
                            error={errors.experiences && errors.experiences[0]?.contact_phone}
                            onFocus={handleInputFocus}
                        />

                        <CustomTextInput
                            control={control}
                            label="Contact Position"
                            mode="outlined"
                            name="experiences[0].contact_position"
                            rules={{ required: 'Contact Position is required' }}
                            error={errors.experiences && errors.experiences[0]?.contact_position}
                            onFocus={handleInputFocus}
                        />

                        <Button
                            mode="contained"
                            onPress={handleOpenSaveBottomSheet}
                            style={styles.saveButton}
                        >
                            Save
                        </Button>
                    </View>
                </ScrollView>
                {showDatePicker && (
                    <DateTimePickerModal
                        isVisible={showDatePicker}
                        mode="date"
                        onConfirm={handleDateChange}
                        onCancel={() => setShowDatePicker(false)}
                        date={selectedDateField === 'experiences[0].date_started' ? dateStartedValue : dateEndedValue}
                    />
                )}
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
                            <TouchableWithoutFeedback onPress={handleSubmit(onSave)}>
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
        backgroundColor: '#F4F7FB'
    },
    saveButton: {
        marginTop: 20,
    },
    divider: {
        marginBottom: 10,
        marginTop: 10,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
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
    dateContainer: {
        marginBottom: 10,
    },
});


export default AddWorkExperience;
