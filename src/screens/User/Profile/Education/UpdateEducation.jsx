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
    const { params } = useRoute();
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            level: params.educationItem?.level || '',
            school_name: params.educationItem?.school_name || '',
            course: params.educationItem?.course || '',
            from: params.educationItem?.from || '',
            to: params.educationItem?.to || '',
        },
    });

    const [fromValue, setFromValue] = useState(() => new Date(watch('from') || new Date()));
    const [toValue, setToValue] = useState(() => new Date(watch('to') || new Date()));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || (selectedDateField === 'from' ? fromValue : toValue);
        setShowDatePicker(false);
        setValue(selectedDateField, moment(currentDate).format('YYYY-MM-DD'));

        if (selectedDateField === 'from') {
            setFromValue(currentDate);
        } else if (selectedDateField === 'to') {
            setToValue(currentDate);
        }
    };

    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setShowDatePicker(true);
    };

    const { mutate, isLoading } = useUpdateEducations();
    const onSave = handleSubmit((data) => {
        console.log("Submitting Data:", data);
        mutate(data);
    });


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
                        items={[
                            { label: 'Select a Level', value: '' },
                            ...['Elementary Education', 'Junior High School', 'Senior High School', 'Baccalaureate', "Master's Degree", "Doctorate Degree"]
                                .map(level => ({ label: level, value: level.toLowerCase().replace(/\s+/g, '_') })),
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
                    {['secondary_k12', 'bacalaureate', 'master', 'doctorate'].includes(watch('level')) && (
                        <CustomTextInput
                            control={control}
                            name="course"
                            label={watch('level') === 'bacalaureate' || watch('level') === 'master' || watch('level') === 'doctorate' ? 'Course' : 'Track'}
                            mode="outlined"
                            rules={{ required: 'Course/Track is required' }}
                        />
                    )}
                    {['from', 'to'].map((field) => (
                        <TouchableOpacity
                            key={field}
                            style={styles.dateContainer}
                            onPress={() => showDatePickerForField(field)}
                        >
                            <CustomTextInput
                                placeholder={field === 'from' ? 'Start date' : 'End date'}
                                control={control}
                                mode="outlined"
                                name={field}
                                label={field === 'from' ? 'Date Started' : 'Date Ended'}
                                editable={false}
                                value={moment(field === 'from' ? fromValue : toValue).format('YYYY-MM-DD')}
                                rules={{ required: `${field === 'from' ? 'Start' : 'End'} Date is required` }}
                            />
                        </TouchableOpacity>
                    ))}
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
