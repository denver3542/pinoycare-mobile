import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const StarRating = ({ rating }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <View style={styles.starContainer}>
            {stars.map((star) => (
                <Icon
                    key={star}
                    name="star"
                    type="font-awesome"
                    color={star <= rating ? "#FFD700" : "#E5E5E5"}
                    size={20}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
    },
});

export default StarRating;
