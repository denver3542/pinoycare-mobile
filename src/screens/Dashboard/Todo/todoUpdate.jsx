import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomTextInput from '../../../../components/CustomTextInput';

const UpdateTodo = () => {
    const navigation = useNavigation();
    const route = useRoute();


    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            level: educationItem.level || '',
            school_name: educationItem.school_name || '',
            course: educationItem.course || '',
            from: educationItem.from || '',
            to: educationItem.to || '',
        },
    });
    // return ( 

    // );  

}


const styles = StyleSheet.create({
});

export default UpdateEducation;
