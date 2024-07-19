// jobRating.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const StarRating = ({ rating }) => {
    const percentage = rating * 25;

    return (
        <View style={styles.container}>
            <View style={styles.stars}>
                {[1, 2, 3, 4].map((star) => (
                    <FontAwesome
                        key={star}
                        name={star <= rating ? "star" : "star-o"}
                        size={20}
                        color="#FFD700"
                    />
                ))}
            </View>
            <Text style={styles.percentage}>{percentage}% matched</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stars: {
        flexDirection: 'row',
    },
    percentage: {
        marginLeft: 5,
        fontSize: 14,
        color: '#888',
    },
});

export default StarRating;
