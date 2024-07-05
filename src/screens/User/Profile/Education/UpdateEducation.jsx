import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import CustomTextInput from '../../../../components/CustomTextInput';
import CustomSelectBox from '../../../../components/CustomSelectBox';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUpdateEducations } from './hooks/useEducationActions';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

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

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        setValue(selectedDateField, moment(date).format('YYYY-MM-DD'));
        if (selectedDateField === 'from') {
            setFromValue(date);
        } else {
            setToValue(date);
        }
        hideDatePicker();
    };

    const { mutate, isLoading } = useUpdateEducations();

    const onSave = handleSubmit((data) => {
        const payload = {
            [data.level]: [{
                id: educationItem.id,
                school_name: data.school_name,
                course: data.course,
                from: data.from,
                to: data.to
            }]
        };
        mutate(payload, {
            onSuccess: () => {
                navigation.goBack();
            },
        });
    });

    const selectedLevel = watch('level');

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
                    <Appbar.Content title="Update Education" titleStyle={{ color: 'white' }} />
                </Appbar.Header>
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        <CustomSelectBox
                            control={control}
                            name="level"
                            label="School Level"
                            mode="outlined"
                            value={selectedLevel}
                            onChangeText={(text) => setValue('level', text)}
                            items={[
                                // { label: 'Select a Level', value: '' },
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
                                onPress={() => showDatePickerForField('from')}
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
                                onPress={() => showDatePickerForField('to')}
                            />
                        </TouchableOpacity>

                        <Button mode="contained" onPress={handleOpenSaveBottomSheet} disabled={isLoading}>
                            Update
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
                        <Button mode="contained" onPress={handleSubmit(onSave)} style={styles.button} labelStyle={{ color: 'white' }}>
                            Save Changes
                        </Button>
                        <Button textColor='black' onPress={handleCloseSaveBottomSheet} style={styles.button}>
                            Cancel
                        </Button>
                    </View>
                </BottomSheet>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    date={selectedDateField === 'from' ? fromValue : toValue}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB'
    },
    formContainer: {
        paddingHorizontal: 15,
        marginTop: 25,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#0A3480',
        marginBottom: 40,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bottomSheetContent: { paddingHorizontal: 20, paddingVertical: 15 },
    button: { marginTop: 10 },
    dateContainer: {
        marginBottom: 15,
    },
});

export default UpdateEducation;
