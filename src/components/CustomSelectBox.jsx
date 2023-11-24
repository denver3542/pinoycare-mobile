import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

const CustomSelectBox = ({
    control,
    name,
    rules = {},
    styleContainer = {},
    items, // Add items for the dropdown
    ...rest
}) => (
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View style={[styles.inputTextContainer, styleContainer]}>
                <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={{ ...pickerSelectStyles.input, ...rest.style }}
                    onBlur={onBlur}
                >
                    {items.map(item => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                </Picker>
                {!!error && error.message && (
                    <HelperText type="error" visible={!!error}>
                        {error.message}
                    </HelperText>
                )}
            </View>
        )}
    />
);

export default CustomSelectBox;

const styles = StyleSheet.create({
    inputTextContainer: {
        marginBottom: 10,
    },
});

const pickerSelectStyles = StyleSheet.create({
    input: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        backgroundColor: '#fffbfe',
    },
});
