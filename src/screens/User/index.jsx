import React, { useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'
import Carousel from 'react-native-snap-carousel'
import CustomJobCard, { SLIDER_WIDTH, ITEM_WIDTH } from '../../components/CustomJobCard'

function index() {
    const [activeIndex, setActiveIndex] = useState(0);
    const jobs = [
        {
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            imageUrl: 'https://upcareph.com/assets/images/landingicons/icon%203.png'
        },
        {
            title: 'Project Manager',
            company: 'Business Inc',
            location: 'New York, NY',
            imageUrl: 'https://upcareph.com/assets/images/landingicons/icon%203.png'
        },
        {
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            imageUrl: 'https://upcareph.com/assets/images/landingicons/icon%203.png'
        },
    ];
    const avatarSize = SLIDER_WIDTH * 0.15;
    const renderItem = ({ item, index }) => {
        return <CustomJobCard job={item} isActive={index === activeIndex} />;
    };

    return (
        <AuthenticatedLayout>
            <View style={styles.header}>
                <View style={styles.headerContainter}>
                    <Avatar.Image size={avatarSize} source={require('../../../assets/images/hero-bg.jpg')} />
                    <View>
                        <Text style={{ fontWeight: 700 }}>Hi! Francisco</Text>
                        <Text style={{ fontWeight: 700 }}>Welcome to Upcare!</Text>
                    </View>
                </View>
                <View style={styles.headerJobs}>
                    <Text style={styles.textStyle} variant='bodyMedium'>Find <Text style={[styles.textStyle, styles.redText]} variant='bodyMedium'>
                        Jobs
                    </Text>
                    </Text>
                    <Text style={[styles.textStyle, { color: 'blue' }]} variant='bodyMedium'>More
                    </Text>
                </View>
                <View style={styles.carouselContainer}>
                    {jobs.length > 0 ? (
                        <Carousel
                            layout="default"
                            data={jobs}
                            loop={true}
                            renderItem={renderItem}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            onSnapToItem={(index) => setActiveIndex(index)}
                            firstItem={0}
                            contentContainerCustomStyle={styles.carouselContentContainer}
                        />
                    ) : (
                        <View style={styles.noJobsContainer}>
                            <Text style={styles.noJobsText}>No Jobs Available</Text>
                        </View>
                    )}
                </View>
                <View style={styles.categoryJobsView}>
                    <Text style={styles.categoryHeader}>Browse by Categories</Text>

                </View>
            </View>
        </AuthenticatedLayout >

    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        marginHorizontal: 20
    },
    headerContainter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    headerJobs: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    redText: {
        color: 'red',
    },
    noJobsContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: SLIDER_WIDTH,
        height: 150, // Adjust the height as needed
    },
    noJobsText: {
        fontSize: 18,
        color: 'gray',
    },
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryJobsView: {
        marginTop: 40
    },
    categoryHeader: {
        fontWeight: '700',
    }
});

export default index