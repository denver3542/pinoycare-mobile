import React, { useState } from 'react';
import { ScrollView, Image, Text, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button, TouchableRipple, Appbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../../hooks/useUser';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
import { useSeminarsAndTrainings } from './hooks/useSeminarsActions';

const SeminarsAndTrainingsForm = () => {
    const { user } = useUser(); // Accessing user data
    const navigation = useNavigation();
    const { mutate, isLoading, isError, error } = useSeminarsAndTrainings();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateFieldName, setDateFieldName] = useState(null);

    // Initialize form with default values from user data
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            facilitated_by: user?.training?.facilitated_by || '',
            description: user?.training?.description || '',
            date_started: user?.training?.date_started ? new Date(user?.training?.date_started) : new Date(),
            date_completed: user?.training?.date_completed ? new Date(user?.training?.date_completed) : new Date(),

        },
    });

    // Handle date changes
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false);
        setValue(dateFieldName, currentDate);
    };

    const openDatePicker = (fieldName) => {
        setDateFieldName(fieldName);
        setShowDatePicker(true);
    };

    // Image picker function
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to access images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setValue('certificate', result.assets[0]?.uri);
        }
    };

    const onSubmit = handleSubmit((data) => {
        const formData = {
            trainings: [
                {
                    facilitated_by: data.facilitated_by,
                    description: data.description,
                    date_started: data.date_started,
                    date_completed: data.date_completed,

                },
            ],
        };

        mutate(formData);
    });


    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Add Seminars And Trainings" />
            </Appbar.Header>

            <ScrollView style={styles.container}>
                <CustomTextInput
                    control={control}
                    name="facilitated_by"
                    label="Facilitated By"
                    mode="outlined"
                    style={styles.input}
                    rules={{ required: true }}
                    error={errors.facilitated_by}
                />

                <CustomTextInput
                    control={control}
                    name="description"
                    label="Description"
                    mode="outlined"
                    style={styles.input}
                    rules={{ required: true }}
                    error={errors.description}
                />

                {/* Date Started Picker */}
                <View style={styles.datePickerContainer}>
                    <TouchableOpacity onPress={() => openDatePicker('date_started')}>
                        <TextInput
                            label="Date Started"
                            mode="outlined"
                            value={watch('date_started').toLocaleDateString()}
                            style={styles.input}
                            error={errors.date_started}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showDatePicker && dateFieldName === 'date_started' && (
                        <DateTimePicker
                            value={watch('date_started')}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                {/* Date Completed Picker */}
                <View style={styles.datePickerContainer}>
                    <TouchableOpacity onPress={() => openDatePicker('date_completed')}>
                        <TextInput
                            label="Date Completed"
                            mode="outlined"
                            value={watch('date_completed').toLocaleDateString()}
                            style={styles.input}
                            error={errors.date_completed}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showDatePicker && dateFieldName === 'date_completed' && (
                        <DateTimePicker
                            value={watch('date_completed')}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                {/* Certificate Picker */}
                {/* <TouchableRipple style={styles.touchable} onPress={pickImage}>
                    {watch('certificate') ? (
                        <Image source={{ uri: watch('certificate') }} style={styles.image} />
                    ) : (
                        <Text style={styles.text}>Tap to upload certificate image</Text>
                    )}
                </TouchableRipple> */}

                {/* Save Button */}
                <Button mode="contained" onPress={onSubmit} style={styles.saveButton} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : 'Save'}
                </Button>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        marginBottom: 10,
    },
    datePickerContainer: {
        marginBottom: 10,
    },
    touchable: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: '100%',
        borderRadius: 8,
        marginBottom: 16,
        borderColor: 'black',
        borderWidth: 0.8,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    text: {
        color: 'black',
        textAlign: 'center',
    },
    saveButton: {
        marginBottom: 10,
    },
});

export default SeminarsAndTrainingsForm;
