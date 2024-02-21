import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, ImageBackground } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Avatar, Searchbar, Text } from 'react-native-paper';
import AuthenticatedLayout from '../../Layout/User/Unauthorize/AuthenticatedLayout';
import Carousel from 'react-native-snap-carousel';
import CustomJobCard, { SLIDER_WIDTH, ITEM_WIDTH } from '../../components/CustomJobCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
// import { useUser } from "../hooks/useUser";
import RecentJobCard from '../../components/CustomRecentJobCard';
import { useJobs } from '../../hooks/jobService';
const screenWidth = Dimensions.get('window').width;
const imageAspectRatio = 16 / 9; // Adjust this based on your image's aspect ratio
const imageHeight = screenWidth / imageAspectRatio;

function Dashboard(activeNav) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [userData, setUserData] = useState();
    const { jobs, loading, error } = useJobs();
    const avatarSize = SLIDER_WIDTH * 0.15;
    // Assuming you have defined CustomJobCard component somewhere

    const renderItem = ({ item, index }) => {
        return (
            <CustomJobCard
                key={index}
                job={item}
                isActive={index === activeIndex}
            />
        );
    };

    const activeBottomNav = activeNav.route.name;

    return (
        <AuthenticatedLayout activeBottomNav={activeBottomNav}>
            <View style={styles.contentStyle}>
                <View style={[styles.headerContainer, { backgroundColor: '#001234' }]}>
                    <ImageBackground source={require('C:/xampp/htdocs/UPCareMobile/assets/images/hero-bg.jpg')} style={[styles.imageBackground, { width: screenWidth, height: imageHeight }]}>
                        <View style={styles.overlay}>
                            <Text style={styles.headerText}>Noir Tempest</Text>
                            <Text style={styles.subHeaderText}>Professional Butler</Text>
                        </View>
                    </ImageBackground>
                </View>




                <View style={styles.headerJobs}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 15, fontSize: 20 }}>Recommendation</Text>
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
                        jobs.slice(0, 5).map((job, index) => (
                            <RecentJobCard
                                key={index}
                                imageUrl={job.imageUrl}
                                jobTitle={job.title}
                                // type={`${job.type} / ${job.salary_from} - ${job.salary_to}`}
                                type={job.type}
                                location={job.location}
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
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        height: 200,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    },
    subHeaderText: {
        fontSize: 16,
        color: 'white',
        marginTop: 10,
    },
    imageBackground: {
        resizeMode: "cover",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    overlay: {
        backgroundColor: 'rgba(0, 18, 52, 0.70)', // Use provided color with opacity
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0
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
        marginTop: 15,
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

export default Dashboard;
