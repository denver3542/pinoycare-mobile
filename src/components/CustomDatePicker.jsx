import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from "prop-types";

const CustomDatePicker = ({
    control,
    name,
    rules,
    styleContainer,
    ...rest
}) => {
    const theme = useTheme();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDatePicker(Platform.OS === 'ios');
        setSelectedDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <TouchableOpacity onPress={showDatepicker} style={[styles.container, styleContainer]}>
                    <TextInput
                        style={styles.textInput}
                        mode="outlined"
                        editable={false}
                        value={value ? value.toString() : ''}
                        placeholder="Select Date"
                        pointerEvents="none"
                    />
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            onChange={onChangeDate}
                        />
                    )}
                    {error && (
                        <HelperText type="error">
                            {error.message}
                        </HelperText>
                    )}
                </TouchableOpacity>
            )}
        />
    );
};


CustomDatePicker.propTypes = {
    control: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    rules: PropTypes.object,
    styleContainer: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    datePickerContainer: {
        marginVertical: 10,
    },
    textInput: {
        fontSize: 14,
        height: 30,
        paddingVertical: 10,
    },
});

export default CustomDatePicker;
