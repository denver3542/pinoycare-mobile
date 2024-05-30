import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useUpdateWorkExperience } from './hooks/useWorkExperience';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

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
        // Set initial date values when component mounts
        setDateStartedValue(new Date(watch('date_started')));
        setDateEndedValue(new Date(watch('date_ended')));
    }, []);

    const handleDateChange = (event, selectedDate) => {
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

        // Log payload for debugging
        console.log('Payload:', JSON.stringify(payload));

        // Submit the payload
        mutate(payload);
    };

    if (isError) {
        console.error("Failed to update work experience:", error);
        alert("Failed to update work experience: " + error.message);
    }

    const saveBottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '30%'], []);
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
        <TouchableWithoutFeedback>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                    <Appbar.Content title="Update Work Experience" titleStyle={{ color: 'white' }} />
                </Appbar.Header>

                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        {/* Company Name input */}
                        <CustomTextInput
                            control={control}
                            name="company_name"
                            label="Company Name"
                            mode="outlined"
                        />

                        {/* Position input */}
                        <CustomTextInput
                            control={control}
                            name="position"
                            label="Position"
                            mode="outlined"
                        />

                        {/* Date Started input */}
                        <TouchableOpacity
                            style={styles.dateContainer}
                            onPress={() => showDatePickerForField('date_started')}
                        >
                            <CustomTextInput
                                control={control}
                                mode="outlined"
                                name="date_started"
                                label="Date Started"
                                editable={false}
                                value={moment(dateStartedValue).format('YYYY-MM-DD')}
                            />
                        </TouchableOpacity>

                        {/* Date Ended input */}
                        <TouchableOpacity
                            style={styles.dateContainer}
                            onPress={() => showDatePickerForField('date_ended')}
                        >
                            <CustomTextInput
                                control={control}
                                mode="outlined"
                                name="date_ended"
                                label="Date Ended"
                                editable={false}
                                value={moment(dateEndedValue).format('YYYY-MM-DD')}
                            />
                        </TouchableOpacity>

                        {/* Salary input */}
                        <CustomTextInput
                            control={control}
                            name="salary"
                            label="Salary"
                            mode="outlined"
                        />

                        {/* Contact Person input */}
                        <CustomTextInput
                            control={control}
                            name="contact_person"
                            label="Contact Person"
                            mode="outlined"
                        />

                        {/* Contact Phone input */}
                        <CustomTextInput
                            control={control}
                            name="contact_phone"
                            label="Contact Phone"
                            mode="outlined"
                        />

                        {/* Contact Position input */}
                        <CustomTextInput
                            control={control}
                            name="contact_position"
                            label="Contact Position"
                            mode="outlined"
                        />

                        {/* DateTimePicker */}
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDateField === 'date_started' ? dateStartedValue : dateEndedValue}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        {/* Save Button */}
                        <Button mode="contained" onPress={handleOpenSaveBottomSheet} disabled={isLoading}>
                            <Text style={{ color: 'white' }}>Save</Text>
                        </Button>
                    </View>
                </View>
                <BottomSheet
                    ref={saveBottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                >
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Confirm Save</Text>
                        <Text>Are you sure you want to save these changes?</Text>
                        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
                            Save Changes
                        </Button>
                        <Button onPress={handleCloseSaveBottomSheet} style={styles.button}>
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
        backgroundColor: '#F4F7FB'
    },
    dateContainer: {
        // marginBottom: 20,
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
    bottomSheetContent: { paddingHorizontal: 20, paddingVertical: 15 },
    button: { marginTop: 10 }
});

export default UpdateWorkExperience;
