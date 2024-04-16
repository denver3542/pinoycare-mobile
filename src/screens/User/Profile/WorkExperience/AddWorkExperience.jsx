import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Button, Divider } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import AuthenticatedLayout from '../../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../../components/CustomTextInput';
import { useWorkExperience } from './hooks/useWorkExperience';
import { useUser } from '../../../../hooks/useUser';

const AddWorkExperience = () => {
    const navigation = useNavigation();
    const { user } = useUser();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            company_name: '',
            position: '',
            date_started: '',
            date_ended: '',
            salary: '',
            contact_person: '',
            contact_phone: '',
            contact_position: '',
        },
    });

    const { mutate, isLoading } = useWorkExperience();

    const onSubmit = handleSubmit((data) => {
        mutate(data, {
            onError: (error) => {
                console.error('Failed to save work experience:', error);
                // Handle error (e.g., show a notification to the user)
            },
        });
    });

    return (
        <AuthenticatedLayout>
            <Appbar.Header>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Add Work Experience" />
            </Appbar.Header>

            <View style={styles.container}>
                <CustomTextInput
                    control={control}
                    label="Company"
                    mode="outlined"
                    name="company_name"
                    error={errors.company_name}
                />

                <CustomTextInput
                    control={control}
                    label="Position"
                    mode="outlined"
                    name="position"
                    error={errors.position}
                />

                <CustomTextInput
                    control={control}
                    label="Salary"
                    mode="outlined"
                    name="salary"
                    error={errors.salary}
                />

                <CustomTextInput
                    control={control}
                    label="Date Started"
                    mode="outlined"
                    name="date_started"
                    error={errors.date_started}
                />

                <CustomTextInput
                    control={control}
                    label="End Date"
                    mode="outlined"
                    name="date_ended"
                    error={errors.date_ended}
                />

                <Divider />

                <CustomTextInput
                    control={control}
                    label="Contact Person"
                    mode="outlined"
                    name="contact_person"
                    error={errors.contact_person}
                />

                <CustomTextInput
                    control={control}
                    label="Contact Phone"
                    mode="outlined"
                    name="contact_phone"
                    error={errors.contact_phone}
                />

                <CustomTextInput
                    control={control}
                    label="Contact Position"
                    mode="outlined"
                    name="contact_position"
                    error={errors.contact_position}
                />

                <Button
                    mode="contained"
                    onPress={onSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.saveButton}
                >
                    Save
                </Button>
            </View>
        </AuthenticatedLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    saveButton: {
        marginTop: 20,
    },
});

export default AddWorkExperience;
