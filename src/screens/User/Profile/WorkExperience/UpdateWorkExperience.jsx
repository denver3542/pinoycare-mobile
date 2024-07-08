import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useUpdateWorkExperience } from './hooks/useWorkExperience';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';

const UpdateWorkExperience = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { experienceItem } = route.params;
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            company_name: experienceItem.company_name || '',
            position: experienceItem.position || '',
            date_started: experienceItem.date_started || '',
            date_ended: experienceItem.date_ended || '',
            salary: experienceItem.salary || '',
            contact_person: experienceItem.contact_person || '',
            contact_phone: experienceItem.contact_phone || '',
            contact_position: experienceItem.contact_position || '',
        }
    });

    const [dateStartedValue, setDateStartedValue] = useState(new Date());
    const [dateEndedValue, setDateEndedValue] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    useEffect(() => {
        setDateStartedValue(new Date(watch('date_started')));
        setDateEndedValue(new Date(watch('date_ended')));
    }, []);

    const handleDateChange = (selectedDate) => {
        setShowDatePicker(false);
        if (selectedDateField && selectedDate) {
            setValue(selectedDateField, moment(selectedDate).format('YYYY-MM-DD'));
            if (selectedDateField === 'date_started') {
                setDateStartedValue(selectedDate);
            } else if (selectedDateField === 'date_ended') {
                setDateEndedValue(selectedDate);
            }
        }
    };

    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setShowDatePicker(true);
    };

    const { mutate, isLoading, isError, error } = useUpdateWorkExperience();

    const onSubmit = (data) => {
        const payload = {
            experiences: [{
                id: experienceItem.id,
                company_name: data.company_name,
                position: data.position,
                date_started: data.date_started,
                date_ended: data.date_ended,
                salary: data.salary,
                contact_person: data.contact_person,
                contact_phone: data.contact_phone,
                contact_position: data.contact_position,
            }]
        };

        console.log('Payload:', JSON.stringify(payload));
        mutate(payload);
    };

    if (isError) {
        console.error("Failed to update work experience:", error);
        alert("Failed to update work experience: " + error.message);
    }

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


    return (
        <TouchableWithoutFeedback>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                    <Appbar.Content title="Update Work Experience" titleStyle={{ color: 'white' }} />
                </Appbar.Header>

                <ScrollView style={styles.container}>
                    <Spinner
                        visible={isLoading}
                    />
                    <View style={styles.formContainer}>
                        <CustomTextInput
                            control={control}
                            name="company_name"
                            label="Company Name"
                            mode="outlined"
                        />

                        <CustomTextInput
                            control={control}
                            name="position"
                            label="Position"
                            mode="outlined"
                        />

                        <TouchableOpacity
                        >
                            <CustomTextInput
                                control={control}
                                mode="outlined"
                                name="date_started"
                                label="Date Started"
                                editable={false}
                                value={moment(dateStartedValue).format('YYYY-MM-DD')}
                                onPress={() => showDatePickerForField('date_started')}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                        >
                            <CustomTextInput
                                control={control}
                                mode="outlined"
                                name="date_ended"
                                label="Date Ended"
                                editable={false}
                                value={moment(dateEndedValue).format('YYYY-MM-DD')}
                                onPress={() => showDatePickerForField('date_ended')}
                            />
                        </TouchableOpacity>

                        <CustomTextInput
                            control={control}
                            name="salary"
                            label="Salary"
                            mode="outlined"
                        />

                        <CustomTextInput
                            control={control}
                            name="contact_person"
                            label="Contact Person"
                            mode="outlined"
                        />

                        <CustomTextInput
                            control={control}
                            name="contact_phone"
                            label="Contact Phone"
                            mode="outlined"
                        />

                        <CustomTextInput
                            control={control}
                            name="contact_position"
                            label="Contact Position"
                            mode="outlined"
                        />

                        {showDatePicker && (
                            <DateTimePickerModal
                                isVisible={showDatePicker}
                                mode="date"
                                onConfirm={handleDateChange}
                                onCancel={() => setShowDatePicker(false)}
                                date={selectedDateField === 'date_started' ? dateStartedValue : dateEndedValue}
                            />
                        )}

                        <Button mode="contained" onPress={handleOpenSaveBottomSheet}>
                            <Text style={{ color: 'white' }}>Save</Text>
                        </Button>
                    </View>
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
        backgroundColor: '#F4F7FB'
    },
    dateContainer: {
        marginBottom: 20,
    },
    formContainer: {
        paddingHorizontal: 15,
        marginTop: 25,
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

export default UpdateWorkExperience;
