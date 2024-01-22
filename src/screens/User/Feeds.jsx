import React from 'react'
import { Avatar, Button, IconButton, Text } from 'react-native-paper'
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

const Feeds = () => {
    const count = 3;

    const feedItems = Array.from({ length: count }, (_, index) => ({
        id: index,
        userName: 'Rosselyn Cedeño',
        description: 'We are hiring, this role is open.....',
        timeAgo: '1h ago',
        image: require('../../../assets/images/hero-bg.jpg') // Use appropriate images per feed item
    }));

    return (
        <AuthenticatedLayout>
            <ScrollView style={{ paddingBottom: 20 }}>
                {feedItems.map((item) => (
                    <View key={item.id} style={[styles.feedContainer, { marginBottom: 20 }]}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarRow}>
                                <Avatar.Image size={40}
                                    source={item.image}
                                    style={styles.avatarImageStyle}
                                />
                                <Text style={styles.userName}>{item.userName}</Text>
                            </View>
                            <View>
                                <Text style={{ color: 'gray' }}>{item.timeAgo}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ paddingHorizontal: 20, paddingBottom: 10 }}>{item.description}</Text>
                            <Image
                                source={item.image}
                                style={{ width: '100%', height: 250 }}
                            />
                            <View style={styles.footer}>
                                <View></View>
                                <Button icon="arrow-right" mode="text" contentStyle={{ flexDirection: 'row-reverse' }} >Apply Now</Button>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </AuthenticatedLayout>
    )
}

const styles = StyleSheet.create({
    feedContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 10,
    },
    avatarContainer: {
        marginBottom: 20,
        marginTop: 15,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
    },
    avatarImageStyle: {
        borderRadius: 20, // This should match half the size of your avatar to get a circular shape
        // iOS Shadow properties
        shadowColor: 'rgba(0, 0, 0, 0.5)', // Soft shadow with low opacity
        shadowOffset: { width: 0, height: 2 }, // X=0, Y=2 works well for subtle shadows
        shadowOpacity: 1, // Full opacity on the shadow since we've already lowered alpha in the color
        shadowRadius: 8, // The larger the radius, the more diffused the shadow
        // Android Shadow property
        elevation: 8, // Adjust as needed for Android

    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 15
    },

});

export default Feeds