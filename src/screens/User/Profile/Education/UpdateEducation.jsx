import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../../hooks/useUser'; // Import useUser hook
import CustomTextInput from '../../../../components/CustomTextInput';
import CustomSelectBox from '../../../../components/CustomSelectBox';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";
import { useUpdateEducations } from './hooks/useEducationActions';

const UpdateEducation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            "level": route.params.educationItem?.level || '',
            "school_name": route.params.educationItem?.school_name || '',
            "course": route.params.educationItem?.course || '',
            "from": route.params.educationItem?.from || '',
            "to": route.params.educationItem?.to || '',
        },
    });

    const [fromValue, setFromValue] = useState(new Date(watch('from') || new Date()));
    const [toValue, setToValue] = useState(new Date(watch('to') || new Date()));

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDateField && selectedDate) {
            setValue(selectedDateField, selectedDate);
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

    const { mutate, isLoading } = useUpdateEducations();

    const onSave = handleSubmit(async (data) => {
        mutate(data);
    });


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
                            { label: 'Bacalaureate', value: 'bacalaureate' },
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
                    {selectedLevel === 'secondary_k12' && (
                        <CustomTextInput
                            control={control}
                            name="course"
                            label="Track"
                            mode="outlined"
                            rules={{ required: 'Course is required' }}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.dateContainer}
                        onPress={() => showDatePickerForField('from')}
                    >
                        <CustomTextInput
                            placeholder="Start date"
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
                            placeholder="End date"
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
