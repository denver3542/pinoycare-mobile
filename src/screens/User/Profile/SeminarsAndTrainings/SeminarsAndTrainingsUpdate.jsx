import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useUpdateTrainingsAndSeminars } from './hooks/useSeminarsActions';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const SeminarsAndTrainingsUpdate = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { seminarsItem } = route.params;


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

    // Initialize form with default values from seminarsItem
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            facilitated_by: seminarsItem.facilitated_by || '',
            description: seminarsItem.description || '',
            date_started: seminarsItem.date_started || '',
            date_completed: seminarsItem.date_completed || ''
        }
    });

    // State for date values and date picker visibility
    const [dateStartedValue, setDateStartedValue] = useState(new Date(watch('date_started')));
    const [dateCompletedValue, setDateCompletedValue] = useState(new Date(watch('date_completed')));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    // Handle date change
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDateField && selectedDate) {
            setValue(selectedDateField, moment(selectedDate).format('YYYY-MM-DD'));
            if (selectedDateField === 'date_started') {
                setDateStartedValue(selectedDate);
            } else if (selectedDateField === 'date_completed') {
                setDateCompletedValue(selectedDate);
            }
        }
    };

    // Show date picker for a specific field
    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setShowDatePicker(true);
    };

    // Mutation hook for updating seminars and trainings
    const { mutate, isLoading, isError, error } = useUpdateTrainingsAndSeminars();

    // Submit handler for form submission
    const onSubmit = (data) => {
        const payload = {
            trainings: [{
                id: seminarsItem.id,
                facilitated_by: data.facilitated_by,
                description: data.description,
                date_started: data.date_started,
                date_completed: data.date_completed
            }]
        };

        // Log payload for debugging
        console.log('Payload:', payload);

        // Call the mutation function with the payload
        mutate(payload);
    };

    // Handle error state
    if (isError) {
        console.error("Failed to update seminars and trainings:", error);
        alert("Failed to update seminars and trainings: " + error.message);
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1 }}>
                {/* Appbar with back action and title */}
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                    <Appbar.Content title="Update Seminars" titleStyle={{ color: 'white' }} />
                </Appbar.Header>

                <ScrollView>
                    <View style={{ padding: 8 }}>
                        {/* Form for updating seminars and trainings */}
                        <View style={styles.container}>
                            {/* Facilitator input */}
                            <CustomTextInput
                                control={control}
                                name="facilitated_by"
                                label="Facilitator"
                                mode="outlined"
                            />

                            {/* Date started input using TouchableOpacity */}
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

                            {/* Date completed input using TouchableOpacity */}
                            <TouchableOpacity
                                style={styles.dateContainer}
                                onPress={() => showDatePickerForField('date_completed')}
                            >
                                <CustomTextInput
                                    control={control}
                                    mode="outlined"
                                    name="date_completed"
                                    label="Date Completed"
                                    editable={false}
                                    value={moment(dateCompletedValue).format('YYYY-MM-DD')}
                                />
                            </TouchableOpacity>

                            {/* Description input */}
                            <CustomTextInput
                                control={control}
                                name="description"
                                label="Description"
                                multiline={true}
                                numberOfLines={4}
                                mode="outlined"
                            />

                            {/* DateTimePicker */}
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDateField === 'date_started' ? dateStartedValue : dateCompletedValue}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}

                            {/* Submit button */}
                            <Button mode="contained" onPress={handleOpenSaveBottomSheet} disabled={isLoading}>
                                <Text style={{ color: 'white' }}>Save</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
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
        // paddingHorizontal: 8,
        // marginVertical: 20

    },
    bottomSheetContent: { paddingHorizontal: 20, paddingVertical: 15 },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
});

export default SeminarsAndTrainingsUpdate;
