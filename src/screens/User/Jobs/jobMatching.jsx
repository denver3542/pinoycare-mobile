import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const JobMatching = ({ rating }) => {
    const percentage = rating * 25;

    return (
        <View style={styles.container}>
            <Text style={styles.percentage}>
                {percentage}%
            </Text>
            <Text style={styles.matchedText}>Matched</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    percentage: {
        color: '#0A3480',
        fontWeight: '600'
        // fontSize: 10,
    },
    matchedText: {
        color: '#0A3480',
        marginLeft: 5,
        fontWeight: '600'
    },
});

export default JobMatching;
