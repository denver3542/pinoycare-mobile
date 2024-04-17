import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, Image } from 'react-native';
import { TextInput, Button, Appbar, TouchableRipple } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../../hooks/useUser';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
import { useSeminarsAndTrainings } from './hooks/useSeminarsActions';

const SeminarsAndTrainingsForm = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const { mutate, isLoading, isError, error } = useSeminarsAndTrainings();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateFieldName, setDateFieldName] = useState(null);
    const [certificateUri, setCertificateUri] = useState(null);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            facilitated_by: user?.training?.facilitated_by || '',
            description: user?.training?.description || '',
            date_started: user?.training?.date_started ? new Date(user?.training?.date_started) : new Date(),
            date_completed: user?.training?.date_completed ? new Date(user?.training?.date_completed) : new Date(),
            certificate: null,
        },
    });

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false);
        setValue(dateFieldName, currentDate);
    };

    const openDatePicker = (fieldName) => {
        setDateFieldName(fieldName);
        setShowDatePicker(true);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setValue('certificate', result.assets[0].uri);
            setCertificateUri(result.assets[0].uri);
        }
    };


    const onSubmit = handleSubmit((data) => {
        const formData = new FormData();
        formData.append('trainings[0][facilitated_by]', data.facilitated_by);
        formData.append('trainings[0][description]', data.description);
        formData.append('trainings[0][date_started]', data.date_started.toISOString().slice(0, 10));
        formData.append('trainings[0][date_completed]', data.date_completed.toISOString().slice(0, 10));
        if (data.certificate) {
            const file = {
                uri: data.certificate,
                type: 'image/jpeg',
                name: 'certificate.jpg'
            };
            formData.append('trainings[0][certificates]', file);
        }

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
                <TouchableRipple style={styles.touchable} onPress={pickImage}>
                    {watch('certificate') ? (
                        <Image source={{ uri: watch('certificate') }} style={styles.image} />
                    ) : (
                        <Text style={styles.text}>Tap to upload certificate image</Text>
                    )}
                </TouchableRipple>

                {/* Save Button */}
                <Button mode="contained" onPress={onSubmit} style={styles.saveButton} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : 'Save'}
                </Button>

                {isError && <Text>Error: {error.message}</Text>}
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
    image: { // Ensure correct style for displaying the image
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
    },
    saveButton: {
        marginBottom: 10,
    },
});


export default SeminarsAndTrainingsForm;
