import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Divider } from 'react-native-paper';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8)

const CustomJobCard = ({ job, isActive }) => {
    return (
        <View style={[styles.card, isActive ? styles.activeCard : null]}>
            <View style={styles.textContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={styles.company}>
                        <Image
                            source={require('../../assets/images/hero-bg.jpg')}
                            style={{ width: 50, height: 50, borderRadius: 50, margin: '0 auto' }}
                        />
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 3 }}>{job.company}</Text>
                            <Text style={{ fontSize: 12 }}>{job.location}</Text>
                        </View>
                    </View>

                </View>
                <View style={{ position: 'absolute', right: 25, top: 5 }}>
                    <FontAwesome5 name={'bookmark'} color={'black'} size={20} style={{ marginTop: 5, color: 'black' }} />
                </View>
            </View>
            <View style={styles.JobContent}>
                <Text style={{ fontSize: 16 }}>{job.title}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>Remote</Text>

            </View>
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, marginVertical: 15, borderRadius: 10, padding: 8, width: 90, textAlign: 'center', color: 'white', backgroundColor: '#007aff' }}>Apply Now</Text>
                <Text style={{ fontSize: 14, marginVertical: 15, borderRadius: 10, padding: 8, fontWeight: 'bold' }}>$100 - $200</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        height: 'auto',
        marginVertical: 10,
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        position: 'relative',
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    activeCard: {
        // Active styles
        scale: 1,
        opacity: 1,
    },
    textContainer: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
    },

    company: {
        flexDirection: 'row',
        margin: '0 auto',
        gap: 20,
    },
    JobContent: {
        flexDirection: 'column',
        marginTop: 20,
    }
});

export default CustomJobCard;
