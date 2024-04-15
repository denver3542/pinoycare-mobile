import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import CustomTextInput from '../../../../components/CustomTextInput';
import CustomSelectBox from '../../../../components/CustomSelectBox';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import { useUpdateEducations } from './hooks/useEducationActions';

const UpdateEducation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { educationItem } = route.params;


    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            level: educationItem.level || '',
            school_name: educationItem.school_name || '',
            course: educationItem.course || '',
            from: educationItem.from || '',
            to: educationItem.to || '',
        },
    });

    const [fromValue, setFromValue] = useState(new Date(watch('from')));
    const [toValue, setToValue] = useState(new Date(watch('to')));

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDateField && selectedDate) {
            setValue(selectedDateField, moment(selectedDate).format('YYYY-MM-DD'));
            if (selectedDateField === 'from') {
                setFromValue(selectedDate);
            } else {
                setToValue(selectedDate);
            }
        }
    };

    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setShowDatePicker(true);
    };

    // Use the `useUpdateEducations` hook to handle updating the education entry
    const { mutate, isLoading } = useUpdateEducations();

    // Handle form submission
    const onSave = handleSubmit((data) => {
        // Create the payload according to the provided structure
        const payload = {
            [data.level]: [{
                id: educationItem.id,
                school_name: data.school_name,
                course: data.course,
                from: data.from,
                to: data.to
            }]
        };

        // Pass the payload to the `mutate` function to update the education entry
        mutate(payload, {
            onSuccess: () => {
                // Navigate back upon success
                navigation.goBack();
            },
        });
    });

    // Watch the selected level
    const selectedLevel = watch('level');

    return (
        <AuthenticatedLayout>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Update Education" />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.heading}>Education</Text>

                    <CustomSelectBox
                        control={control}
                        name="level"
                        label="School Level"
                        mode="outlined"
                        value={selectedLevel}
                        onChangeText={(text) => setValue('level', text)}
                        items={[
                            { label: 'Select a Level', value: '' },
                            { label: 'Elementary Education', value: 'elementary' },
                            { label: 'Junior High School', value: 'secondary' },
                            { label: 'Senior High School', value: 'secondary_k12' },
                            { label: 'Baccalaureate', value: 'baccalaureate' },
                            { label: "Master's Degree", value: 'master' },
                            { label: "Doctorate Degree", value: 'doctorate' },
                        ]}
                        rules={{ required: 'Please select a level' }}
                    />
                    <CustomTextInput
                        control={control}
                        name="school_name"
                        label="School Name"
                        mode="outlined"
                        rules={{ required: 'School Name is required' }}
                    />
                    {(selectedLevel === 'secondary_k12' || selectedLevel === 'baccalaureate' || selectedLevel === 'master' || selectedLevel === 'doctorate') && (
                        <CustomTextInput
                            control={control}
                            name="course"
                            mode="outlined"
                            label={selectedLevel === 'baccalaureate' || selectedLevel === 'master' || selectedLevel === 'doctorate' ? 'Course' : 'Track'}
                            rules={{ required: selectedLevel === 'secondary_k12' ? 'Track is required' : 'Course is required' }}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.dateContainer}
                        onPress={() => showDatePickerForField('from')}
                    >
                        <CustomTextInput
                            control={control}
                            mode="outlined"
                            name="from"
                            label="Date Started"
                            editable={false}
                            value={moment(fromValue).format('YYYY-MM-DD')}
                            rules={{ required: 'Start Date is required' }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.dateContainer}
                        onPress={() => showDatePickerForField('to')}
                    >
                        <CustomTextInput
                            control={control}
                            mode="outlined"
                            name="to"
                            label="Date Ended"
                            editable={false}
                            value={moment(toValue).format('YYYY-MM-DD')}
                            rules={{ required: 'End Date is required' }}
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDateField === 'from' ? fromValue : toValue}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                    <Button mode="contained" onPress={onSave} disabled={isLoading}>
                        Update
                    </Button>
                </View>
            </View>
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 15,
        marginTop: 60,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#0A3480',
        marginBottom: 40,
    },
    dateContainer: {
        marginBottom: 20,
    },
});

export default UpdateEducation;
