import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Button, Divider } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useWorkExperience } from './hooks/useWorkExperience';
import { useUser } from '../../../../hooks/useUser';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const AddWorkExperience = () => {
    const navigation = useNavigation();
    const { user } = useUser();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            experiences: [{
                company_name: user?.company_name || '',
                position: user?.position || '',
                date_started: user?.date_started || '',
                date_ended: user?.date_ended || '',
                salary: user?.salary || '',
                contact_person: user?.contact_person || '',
                contact_phone: user?.contact_phone || '',
                contact_position: user?.contact_position || '',
            }],
        },
    });

    const { mutate, isLoading } = useWorkExperience();

    const onSave = handleSubmit((data) => {
        mutate(data);
    });


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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                    <Appbar.BackAction onPress={navigation.goBack} color='white' />
                    <Appbar.Content title="Add Work Experience" titleStyle={{ color: 'white' }} />
                </Appbar.Header>
                <ScrollView style={styles.container}>
                    <View style={{ padding: 8 }}>
                        <CustomTextInput
                            control={control}
                            label="Company Name"
                            mode="outlined"
                            name="experiences[0].company_name"
                            rules={{ required: 'Company Name is required' }}
                            error={errors.experiences && errors.experiences[0]?.company_name}
                        />

                        <CustomTextInput
                            control={control}
                            label="Position"
                            mode="outlined"
                            name="experiences[0].position"
                            rules={{ required: 'Position is required' }}
                            error={errors.experiences && errors.experiences[0]?.position}
                        />

                        <CustomTextInput
                            control={control}
                            label="Date Started"
                            mode="outlined"
                            name="experiences[0].date_started"
                            rules={{ required: 'Start Date is required' }}
                            error={errors.experiences && errors.experiences[0]?.date_started}
                        />

                        <CustomTextInput
                            control={control}
                            label="Date Ended"
                            mode="outlined"
                            name="experiences[0].date_ended"
                            rules={{ required: 'End Date is required' }}
                            error={errors.experiences && errors.experiences[0]?.date_ended}
                        />

                        <CustomTextInput
                            control={control}
                            label="Salary"
                            mode="outlined"
                            name="experiences[0].salary"
                            rules={{ required: 'Salary is required' }}
                            error={errors.experiences && errors.experiences[0]?.salary}
                        />

                        <Divider style={styles.divider} />

                        <Text style={styles.text}>Contact Person Details</Text>

                        <CustomTextInput
                            control={control}
                            label="Contact Person"
                            mode="outlined"
                            name="experiences[0].contact_person"
                            rules={{ required: 'Contact Person is required' }}
                            error={errors.experiences && errors.experiences[0]?.contact_person}
                        />

                        <CustomTextInput
                            control={control}
                            label="Contact Phone"
                            mode="outlined"
                            name="experiences[0].contact_phone"
                            rules={{ required: 'Contact Phone is required' }}
                            error={errors.experiences && errors.experiences[0]?.contact_phone}
                        />

                        <CustomTextInput
                            control={control}
                            label="Contact Position"
                            mode="outlined"
                            name="experiences[0].contact_position"
                            rules={{ required: 'Contact Position is required' }}
                            error={errors.experiences && errors.experiences[0]?.contact_position}
                        />

                        <Button
                            mode="contained"
                            onPress={handleOpenSaveBottomSheet}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.saveButton}
                        >
                            Save
                        </Button>
                    </View>
                </ScrollView>
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
                        <Button mode="contained" onPress={handleSubmit(onSave)} style={styles.button}>
                            Save Changes
                        </Button>
                        <Button onPress={handleCloseSaveBottomSheet} style={styles.button}>
                            Cancel
                        </Button>
                    </View>
                </BottomSheet>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB'
        // padding: 15,
    },
    saveButton: {
        marginTop: 20,
    },
    divider: {
        marginBottom: 10,
        marginTop: 10,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bottomSheetContent: { paddingHorizontal: 20, paddingVertical: 15 },
    button: { marginTop: 10 }
});

export default AddWorkExperience;
