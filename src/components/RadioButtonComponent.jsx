import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const RadioButtonGroup = ({ selectedRadioButton, handleRadioButtonChange }) => (
    <View style={styles.radioButton}>
        <Text style={styles.radioGroupText}>Are you a K to 12 student?</Text>
        <RadioButton.Group onValueChange={handleRadioButtonChange} value={selectedRadioButton}>
            <View style={styles.radioGroupView}>
                {['Yes', 'No'].map((option) => (
                    <TouchableOpacity key={option} onPress={() => handleRadioButtonChange(option)} style={styles.radioGroupOption}>
                        <Text>{option}</Text>
                        <RadioButton value={option} />
                    </TouchableOpacity>
                ))}
            </View>
        </RadioButton.Group>
    </View>
);

const styles = StyleSheet.create({
    radioButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    radioGroupText: {
        marginTop: 10,
        fontSize: 14,
        marginRight: 50,
        color: '#0A3480',
        fontWeight: 'bold',
    },
    radioGroupView: {
        flexDirection: 'row',
    },
    radioGroupOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default RadioButtonGroup;
