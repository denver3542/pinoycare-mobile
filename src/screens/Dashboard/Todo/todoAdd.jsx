import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Text, Keyboard } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import CustomTextInput from "../../../components/CustomTextInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import Spinner from 'react-native-loading-spinner-overlay';
import { format } from 'date-fns';
import { useAddTodoData } from './hooks/useTodo';

const TodoAdd = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, setValue, watch } = useForm();
    const { mutate: addTodo } = useAddTodoData();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateFieldName, setDateFieldName] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [loading, setLoading] = useState(false);

    const formatDateForDisplay = (date) => format(date, 'MMM dd, yyyy h:mm a');

    const formatDateForSubmission = (date) => format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");

    const handleConfirm = (date) => {
        setDatePickerVisibility(false);

        const formattedForDisplay = formatDateForDisplay(date);
        const formattedForSubmission = formatDateForSubmission(date);

        if (dateFieldName === 'start_time') {
            setStartTime(date);
        }

        setValue(dateFieldName, formattedForDisplay);
        setValue(`${dateFieldName}_iso`, formattedForSubmission);
    };

    const showDatePicker = (fieldName) => {
        setDateFieldName(fieldName);
        setDatePickerVisibility(true);
    };

    const validateTimes = (data) => {
        const { start_time_iso, end_time_iso } = data;

        if (start_time_iso && end_time_iso) {
            const startDate = new Date(start_time_iso);
            const endDate = new Date(end_time_iso);

            if (endDate < startDate) {
                alert('End time must be after or equal to the start time.');
                return false;
            }
        }

        return true;
    };

    const onSubmit = async (data) => {
        if (validateTimes(data)) {
            const submitData = {
                title: data.title,
                description: data.description,
                start_time: data.start_time_iso,
                end_time: data.end_time_iso
            };

            console.log("Submitting data:", submitData);

            try {
                setLoading(true);
                await addTodo(submitData);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error adding todo:", error);
                if (error.response && error.response.data) {
                    alert(`Error: ${JSON.stringify(error.response.data)}`);
                } else {
                    alert("An unknown error occurred.");
                }
            }
        }
    };

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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >

            <ScrollView contentContainerStyle={styles.containerWrapper}>
                <CustomTextInput
                    control={control}
                    name="title"
                    label="Title"
                    mode="outlined"
                    rules={{ required: 'This field is required' }}
                />
                <CustomTextInput
                    control={control}
                    name="description"
                    label="Note"
                    mode="outlined"
                    multiline={true}
                    numberOfLines={5}
                    rules={{ required: 'This field is required' }}
                />

                <View style={styles.datePickerContainer}>
                    <TouchableOpacity onPress={() => showDatePicker('start_time')}>
                        <TextInput
                            label="Start"
                            mode="outlined"
                            name="start_time"
                            value={watch('start_time')}
                            editable={false}
                            style={styles.dateInput}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.datePickerContainer}>
                    <TouchableOpacity onPress={() => showDatePicker('end_time')}>
                        <TextInput
                            label="End"
                            mode="outlined"
                            name="end_time"
                            value={watch('end_time')}
                            editable={false}
                            style={styles.dateInput}
                        />
                    </TouchableOpacity>
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                    minimumDate={dateFieldName === 'end_time' && startTime ? startTime : undefined}
                />

                <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                    Submit
                </Button>
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
                        <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCloseSaveBottomSheet}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheet>
            {loading && <Spinner visible={true} textContent={"Loading..."} textStyle={styles.spinnerTextStyle} />}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerWrapper: {
        flexGrow: 1,
        padding: 8,
    },
    dateInput: {
        marginBottom: 8,
    },
    datePickerContainer: {
        marginBottom: 8,
    },
    saveButton: {
        marginBottom: 10,
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
    spinnerTextStyle: {
        color: '#FFF'
    }
});

export default TodoAdd;
