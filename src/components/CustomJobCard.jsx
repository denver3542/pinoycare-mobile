import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8)

const CustomJobCard = ({ job, isActive }) => {
    return (
        <View style={[styles.card, isActive ? styles.activeCard : null]}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{job.title}</Text>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.location}>{job.location}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        height: 200,
        marginVertical: 10,
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    activeCard: {
        // Active styles
        scale: 1,
        opacity: 1,
    },
    textContainer: {
        padding: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    company: {
        fontSize: 14,
        color: 'gray'
    },
    location: {
        fontSize: 12
    }
});

export default CustomJobCard;
