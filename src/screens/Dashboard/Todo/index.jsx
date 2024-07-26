import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';

const TodoCard = ({ rate }) => {
    const navigation = useNavigation();

    const percentage = rate * 25;
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text style={styles.headerTextStyle}>Your today's task</Text>
                    <Text style={styles.headerTextStyle}>almost done!</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('TodoList')}
                    >
                        <Text style={styles.buttonText}>View To Do</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.progressContainer}>
                    <AnimatedCircularProgress
                        size={90}
                        width={6}
                        fill={percentage}
                        tintColor="#FDED56"
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
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 25,
        backgroundColor: '#0A3480',
        borderRadius: 14,
        justifyContent: 'center'
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,

    },
    headerTextStyle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white'
    },
    button: {
        marginTop: 10,
        backgroundColor: '#E4DFFF',
        paddingVertical: 6,
        alignItems: 'center',
        width: 100,
        borderRadius: 8,

    },
    buttonText: {
        color: '#0A3480',
        fontWeight: 'bold',
        fontSize: 14
    },
    progressContainer: {
        marginLeft: 10,
        right: 10
    }
});

export default TodoCard;
