import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const JobMatching = ({ rating }) => {
    const percentage = rating * 25;

    return (
        <View style={styles.container}>
            <AnimatedCircularProgress
                size={50}
                width={5}
                fill={percentage}
                tintColor="#0A3480"
                backgroundColor="gray"
            >
                {
                    (fill) => (
                        <Text style={styles.percentage}>
                            {percentage}%
                        </Text>
                    )
                }
            </AnimatedCircularProgress>
            <Text style={styles.matchedText}>matched</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    percentage: {
        fontSize: 12,
    },
    matchedText: {
        marginLeft: 10,
    },
});

export default JobMatching;
