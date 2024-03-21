import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomSelectBox from "../../../components/CustomSelectBox";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../../components/CustomTextInput';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../hooks/useUser';
import useEducations from './Education/hooks/useEducations';

const EducationForm = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            level: '',
            school_name: '',
            course: '',
            track: '',
            from: new Date(),
            to: new Date(),
        },
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    const fromValue = watch('from') || new Date();
    const toValue = watch('to') || new Date();

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDateField) {
            setValue(selectedDateField, selectedDate || new Date());
        }
    };

    const { mutate, isLoading } = useEducations();

    useEffect(() => {
        if (user) {
            setValue('level', user.level);
            setValue('school_name', user.school_name);
            setValue('course', user.course);
            setValue('track', user.track);
            setValue('from', user.from);
            setValue('to', user.to);
        }
    }, [user, setValue]);

    const onSave = handleSubmit(data => {
        mutate(data);
    });

    const selectedLevel = watch('level');

    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setShowDatePicker(true);
    };

    return (
        <AuthenticatedLayout>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Add Education" />
            </Appbar.Header>
            <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
                <View style={{ paddingHorizontal: 15, marginTop: 60 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#0A3480', marginBottom: 40 }}>About Me</Text>

                    <CustomSelectBox
                        selectedValue={selectedLevel}
                        onValueChange={(itemValue) => {
                            setValue('level', itemValue);
                        }}
                        control={control}
                        name="level"
                        items={[
                            { label: 'Select a Level', value: '' },
                            { label: 'Elementary Education', value: 'elementary' },
                            { label: 'Junior High School', value: 'secondary' },
                            { label: 'Senior High School', value: 'secondary_k12' },
                            { label: 'Bacalaureate', value: 'bacalaureate' },
                            { label: "Master's Degree", value: 'master' },
                            { label: "Doctorate Degree", value: 'doctorate' },
                        ]}
                        rules={{ required: "Please Select a Level" }}
                    />
                    <CustomTextInput
                        placeholder="School Name"
                        control={control}
                        name="school_name"
                        rules={{ required: 'School Name is required' }}
                    />
                    {(selectedLevel !== 'elementary' && selectedLevel !== 'secondary') && (
                        <CustomTextInput
                            placeholder="Course"
                            control={control}
                            name="course"
                            rules={{ required: 'Course is required' }}
                        />
                    )}
                    {selectedLevel === 'secondary_k12' && (
                        <CustomTextInput
                            placeholder="Track"
                            control={control}
                            name="track"
                            rules={{ required: 'Track is required' }}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.dateContainer}
                        onPress={() => showDatePickerForField('from')}
                    >
                        <CustomTextInput
                            placeholder="Start date"
                            control={control}
                            name="from"
                            editable={false}
                            value={fromValue.toLocaleDateString()}
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
                            name="to"
                            editable={false}
                            value={toValue.toLocaleDateString()}
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
                        Save
                    </Button>
                </View>
            </View>
            <Spinner visible={isLoading} />
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default EducationForm;
