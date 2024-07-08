import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Appbar, ActivityIndicator } from 'react-native-paper';
import CustomTextInput from '../../../components/CustomTextInput';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../hooks/useUser';
import { useEducations } from './Education/hooks/useEducationActions';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomSelectBox from "../../../components/CustomSelectBox";
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const EducationForm = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            level: '',
            school_name: '',
            track: '',
            from: new Date(),
            to: new Date(),
        },
    });

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDateField, setSelectedDateField] = useState(null);

    const fromValue = watch('from') || new Date();
    const toValue = watch('to') || new Date();

    const { mutate, isLoading } = useEducations();

    useEffect(() => {
        if (user) {
            setValue('level', user.level);
            setValue('school_name', user.school_name);
            setValue('track', user.track);
            setValue('from', user.from);
            setValue('to', user.to);
        }
    }, [user, setValue]);

    const onSave = handleSubmit(async (data) => {
        await mutate(data);
    });

    const bottomSheetRef = useRef(null);

    const handleCloseSaveBottomSheet = () => bottomSheetRef.current?.close();
    const handleOpenSaveBottomSheet = () => {
        Keyboard.dismiss();
        setTimeout(() => bottomSheetRef.current?.expand(), 50);
    };

    const snapPoints = useMemo(() => ['25%'], []);

    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const selectedLevel = watch('level');

    const showDatePickerForField = (fieldName) => {
        setSelectedDateField(fieldName);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        setValue(selectedDateField, date);
        hideDatePicker();
    };

    const levelOptions = [
        { label: 'Elementary Education', value: 'elementary' },
        { label: 'Junior High School', value: 'secondary' },
        { label: 'Senior High School', value: 'secondary_k12' },
        { label: 'Baccalaureate', value: 'baccalaureate' },
        { label: "Master's Degree", value: 'master' },
        { label: "Doctorate Degree", value: 'doctorate' },
    ];

    return (
        <View style={{ flex: 1 }}>
            <Spinner
                visible={isLoading}
            />
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
                <Appbar.Content title="Add Education" titleStyle={{ color: 'white' }} />
            </Appbar.Header>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{ paddingHorizontal: 8, marginVertical: 20 }}>
                        <CustomSelectBox
                            control={control}
                            name="level"
                            label="Education Level"
                            items={levelOptions}
                            rules={{ required: 'Please select a level' }}
                        />
                        <CustomTextInput
                            control={control}
                            name="school_name"
                            label="School Name"
                            mode="outlined"
                            rules={{ required: 'School Name is required' }}
                        />
                        {((selectedLevel === 'secondary_k12') || (selectedLevel === 'baccalaureate') || (selectedLevel === 'master') || (selectedLevel === 'doctorate')) && (
                            <CustomTextInput
                                control={control}
                                name="track"
                                mode="outlined"
                                label={(selectedLevel === 'baccalaureate' || selectedLevel === 'master' || selectedLevel === 'doctorate') ? 'Course' : 'Track'}
                                rules={{ required: (selectedLevel === 'secondary_k12') ? 'Track is required' : 'Course is required' }}
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
                                onPress={() => showDatePickerForField('from')}
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
                                onPress={() => showDatePickerForField('to')}
                            />
                        </TouchableOpacity>
                        <Button mode="contained" onPress={handleOpenSaveBottomSheet} disabled={isLoading}>
                            Save
                        </Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                date={fromValue}
            />
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
            >
                <BottomSheetView style={styles.bottomSheetContent}>
                    <Text style={styles.bottomSheetTitle}>Confirm Save</Text>
                    <Text>Are you sure you want to save these changes?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableWithoutFeedback onPress={onSave}>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB'
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
        marginBottom: 15,
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});

export default EducationForm;
