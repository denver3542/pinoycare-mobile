import React from 'react'
import { Button, Divider, Searchbar, Text } from 'react-native-paper'
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'
import { Image, StyleSheet, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

const Jobs = (activeNav) => {
    const activeBottomNav = activeNav.route.name;
    return (
        <AuthenticatedLayout activeBottomNav={activeBottomNav}>
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={styles.company}>
                            <Image
                                source={require('../../../assets/images/hero-bg.jpg')}
                                style={{ width: 50, height: 50, borderRadius: 50, margin: '0 auto' }}
                            />
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 3 }}>Infinity Hub</Text>
                                <Text style={{ fontSize: 12 }}>Davao City Philippines</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ position: 'absolute', right: 25, top: 5 }}>
                        <FontAwesome5 name={'bookmark'} color={'black'} size={20} style={{ marginTop: 5, color: 'black' }} />
                    </View>
                </View>
                <View style={styles.JobContent}>
                    <Text style={{ fontSize: 16 }}>Web Developer</Text>
                    <Text style={{ fontSize: 12, color: 'gray' }}>Remote</Text>

                </View>
                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, marginVertical: 15, borderRadius: 10, padding: 8, width: 90, textAlign: 'center', color: 'white', backgroundColor: '#007aff' }}>Apply Now</Text>
                    <Text style={{ fontSize: 14, marginVertical: 15, borderRadius: 10, padding: 8, fontWeight: 'bold' }}>$100 - $200</Text>
                </View>
            </View>
        </AuthenticatedLayout>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%',
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
})
export default Jobs