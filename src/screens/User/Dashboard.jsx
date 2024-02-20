import React, { useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native';
import { Avatar, Searchbar, Text } from 'react-native-paper'
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout'
import Carousel from 'react-native-snap-carousel'
import CustomJobCard, { SLIDER_WIDTH, ITEM_WIDTH } from '../../components/CustomJobCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import RecentJobCard from '../../components/CustomRecentJobCard';
import { useJobs } from '../../hooks/jobService';


function Dashboard(activeNav) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [userData, setUserData] = useState();

    // Use the useJobs hook to fetch jobs data
    const { jobs, loading, error } = useJobs();

    const avatarSize = SLIDER_WIDTH * 0.15;
    const renderItem = ({ item, index }) => {
        return <CustomJobCard job={item} isActive={index === activeIndex} />;
    };
    const activeBottomNav = activeNav.route.name;

    useEffect(() => {
        const checkUserData = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('upcare_user');
                if (storedUserData !== null) {
                    // We have user data
                    setUserData(JSON.parse(storedUserData));
                } else {
                    setUserData([])
                }
            } catch (error) {
                console.error('Error reading user data:', error);
            }
        };

        checkUserData();
    }, []);

    return (
        <AuthenticatedLayout activeBottomNav={activeBottomNav}>
            <View style={styles.contentStyle}>
                <View style={styles.headerJobs}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 15, fontSize: 20 }}>Recommendation
                    </Text>
                </View>
                <View style={styles.carouselContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : error ? (
                        <Text>{error}</Text>
                    ) : jobs.length > 0 ? (
                        <Carousel
                            layout="default"
                            data={jobs}
                            loop={true}
                            renderItem={renderItem}
                            sliderWidth={SLIDER_WIDTH}
                            itemWidth={ITEM_WIDTH}
                            onSnapToItem={(index) => setActiveIndex(index)}
                            firstItem={0}
                        />
                    ) : (
                        <View style={styles.noJobsContainer}>
                            <Text style={styles.noJobsText}>No Jobs Available</Text>
                        </View>
                    )}
                </View>
                <View style={styles.headerJobs}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 15, fontSize: 20 }}>Recent Job List</Text>
                </View>
                <View style={styles.categoryJobsView}>
                    {jobs && jobs.length > 0 ? (
                        jobs.map((job, index) => (
                            <RecentJobCard
                                key={index}
                                jobTitle={job.title}
                                company={job.company}
                                location={job.location}
                                imageUrl={job.imageUrl}
                                onPress={() => {
                                    console.log(`Job item ${index + 1} pressed!`);
                                }}
                            />
                        ))
                    ) : (
                        <View style={styles.noJobsContainer}>
                            <Text style={styles.noJobsText}>No Jobs Available</Text>
                        </View>
                    )}
                </View>
            </View>
        </AuthenticatedLayout>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerJobs: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        height: 150,
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
        marginTop: 20,
    },
    categoryBox: {
        backgroundColor: 'white',
        width: '100%',
        flex: 2,
        padding: 10,
        borderRadius: 10,
        height: 150,
        shadowColor: 'blue',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});


export default Dashboard