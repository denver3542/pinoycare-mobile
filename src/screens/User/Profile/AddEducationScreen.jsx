import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Card, RadioButton, Appbar, Divider } from 'react-native-paper';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from '../../../../utils/axiosConfig';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { useUser } from '../../../hooks/useUser';
import CustomTextInput from '../../../components/CustomTextInput';

const EditEducation = () => {
    const { user } = useUser();
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            educations: user?.educations || [],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'educations' });


    const updateEducations = useCallback(async (dataToUpdate) => {
        try {
            const user = JSON.parse(await AsyncStorage.getItem('upcare_user'));
            const headers = getJWTHeader(user);
            const { data } = await axiosInstance.put('/user/profile/edit-educations', dataToUpdate, { headers });

            // Log data being submitted
            console.log('LOG Data being submitted:');
            dataToUpdate.educations.forEach((education, index) => {
                console.log(`LOG Education ${index + 1} ID:`, education.id);
                console.log(`LOG Education ${index + 1} Data:`, education);
            });

            const updatedUser = { ...user, ...dataToUpdate };
            queryClient.setQueryData(['user'], updatedUser);
            await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
            console.log('LOG Education update successful:', data);

            return { originalData: dataToUpdate, responseData: data };
        } catch (error) {
            console.error('Error updating education:', error);
            throw error;
        }
    }, [queryClient]);

    const onSubmit = useCallback(async (data) => {
        try {
            const responseData = await updateEducations(data);


            console.log('LOG Education update response:');
            console.log('LOG originalData:');
            responseData.originalData.educations.forEach((education, index) => {
                console.log(`LOG Education ${index + 1}:`, education);
            });
            console.log('LOG responseData:', responseData.responseData);

            navigation.goBack();
        } catch (error) {
            console.error('Error submitting data:', error);

        }
    }, [navigation, updateEducations]);




    const [selectedRadioButton, setSelectedRadioButton] = useState('');
    const showK12Fields = useMemo(() => selectedRadioButton === 'Yes', [selectedRadioButton]);

    const handleRadioButtonChange = useCallback((value) => {
        setSelectedRadioButton(value);
    }, []);

    return (
        <AuthenticatedLayout>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Edit Educational Background" />
            </Appbar.Header>
            <ScrollView>
                <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
                    <View style={{ padding: 15, marginTop: 40 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#0A3480', marginBottom: 40 }}>Educational Background</Text>

                        <View style={styles.radioButton}>
                            <Text style={{ marginTop: 10, fontSize: 14, marginRight: 50, color: '#0A3480', fontWeight: 'bold' }}>Are you a K to 12 student?</Text>
                            <RadioButton.Group onValueChange={handleRadioButtonChange} value={showK12Fields ? 'Yes' : 'No'}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => handleRadioButtonChange("Yes")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>Yes</Text>
                                        <RadioButton value="Yes" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRadioButtonChange("No")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>No</Text>
                                        <RadioButton value="No" />
                                    </TouchableOpacity>
                                </View>
                            </RadioButton.Group>
                        </View>
                        {fields.map((item, index) => (
                            <View key={item.id}>
                                {(showK12Fields || item.level !== 'secondary_k12') && (
                                    <View style={styles.card}>
                                        <View style={styles.cardContent}>
                                            <View style={styles.sectionHeader}>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0A3480' }}>
                                                    {item.level === 'elementary' ? 'Elementary' :
                                                        item.level === 'secondary' ? 'Secondary' :
                                                            item.level === 'secondary_k12' ? 'Senior High School' :
                                                                item.level === 'baccalaureate' ? 'Baccalaureate' :
                                                                    item.level === 'master' ? 'Master' :
                                                                        item.level === 'doctorate' ? 'Doctorate' : item.level}
                                                </Text>

                                                <Button onPress={() => remove(index)}>Remove</Button>
                                            </View>
                                            <Divider style={styles.divider} />
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0A3480', marginBottom: 4 }}>School Name</Text>
                                            <CustomTextInput
                                                placeholder=""
                                                control={control}
                                                name={`educations.${index}.school_name`}
                                            />
                                            <View style={styles.datePicker}>
                                                <View style={styles.datePickerContainer}>
                                                    <Text style={styles.label}>Date Started</Text>
                                                    <CustomDatePicker control={control} name={`educations.${index}.from`} />
                                                </View>
                                                <View style={styles.datePickerContainer}>
                                                    <Text style={styles.label}>Date Ended</Text>
                                                    <CustomDatePicker control={control} name={`educations.${index}.to`} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                        <Card.Actions>
                            <Button onPress={() => append({ level: '', school_name: '', from: '', to: '', is_k12: '' })} mode=''>Add Education</Button>
                            <Button onPress={handleSubmit(onSubmit)} mode='contained'>Save</Button>
                        </Card.Actions>
                    </View>
                </View>
            </ScrollView>
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    divider: {
        backgroundColor: "#ccc",
        marginBottom: 10,
        marginTop: 10
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    datePickerContainer: {
        flex: 1,
        marginHorizontal: 4,
    },
    radioButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    label: {
        marginBottom: 4,
        fontWeight: 'bold',
        color: '#0A3480'
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    card: {
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    removeButton: {
        fontSize: 14,
        color: 'red',
    },
    cardContent: {
        padding: 5
    },
});


export default EditEducation;
