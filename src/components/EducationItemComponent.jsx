import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Appbar, Divider } from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput'; // Adjust this import path to where your CustomTextInput component is located
import CustomDatePicker from '../components/CustomDatePicker'; // Adjust this import path to where your CustomDatePicker component is located

const EducationItem = ({ item, index, control, remove }) => (
    <View>
        <Text style={styles.educationLevel}>{item.level}</Text>
        <Divider style={styles.divider} />
        <CustomTextInput placeholder="Level of education" control={control} name={`educations.${index}.school_name`} />
        <View style={styles.datePicker}>
            <CustomDatePicker control={control} name={`educations.${index}.from`} label="Date Started" />
            <CustomDatePicker control={control} name={`educations.${index}.to`} label="Date Ended" />
        </View>
        <Button onPress={() => remove(index)} mode="contained" style={styles.btnRemove}>Remove</Button>
    </View>
);
export const styles = StyleSheet.create({

    educationLevel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0A3480',
    },
    divider: {
        backgroundColor: "#ccc",
        marginVertical: 10,
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    btnRemove: {
        marginTop: 10
    }
});
export default EducationItem;
