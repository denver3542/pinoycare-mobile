import React from 'react';
import { Headline, Text, useTheme } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';

export default function Vision() {
    const theme = useTheme();
    return (
        <View style={visionStyles.VisionContainer}>
            <View style={visionStyles.VisionLayout}>
                <Headline style={visionStyles.HeadlineText}>Our Vision</Headline>
                <Text style={[theme.fonts.bodyLarge, visionStyles.ContentText]}>At Pinoycareph, we believe in Filipino professionals' unyielding potential and dedication. Our platform is designed to showcase their talent and connect them seamlessly with employers and organizations that value their expertise.</Text>
            </View>
            <View style={subContentStyle.subContentLayout}>
                <Image
                    source={{ uri: 'https://pinoycareph.com/assets/images/landingicons/icon%203.png' }}
                    style={subContentStyle.image}
                />
                <Headline style={subContentStyle.HeadlineText}>Why We're Unique</Headline>
                <Text style={[theme.fonts.bodyLarge, subContentStyle.ContentText]}>Every professional can curate a distinct profile, encapsulating their experiences, skills, and aspirations.</Text>
            </View>
            <View style={subContentStyle.subContentLayout}>
                <Image
                    source={{ uri: 'https://pinoycareph.com/assets/images/landingicons/icon%202.png' }}
                    style={subContentStyle.image}
                />
                <Headline style={subContentStyle.HeadlineText}>Professionals</Headline>
                <Text style={[theme.fonts.bodyLarge, subContentStyle.ContentText]}>Showcase Your Excellence Build Your Profile: Our intuitive platform lets you illustrate your journey, skills, and aspirations effortlessly.

                </Text>
            </View>
            <View style={subContentStyle.subContentLayout}>
                <Image
                    source={{ uri: 'https://pinoycareph.com/assets/images/landingicons/icon%201.png' }}
                    style={subContentStyle.image}
                />
                <Headline style={subContentStyle.HeadlineText}>Employers</Headline>
                <Text style={[theme.fonts.bodyLarge, subContentStyle.ContentText]}>Discover Filipino Brilliance Diverse Talent Pool: Dive into a reservoir of talented professionals across myriad domains.</Text>
            </View>
        </View>
    );
}

const visionStyles = StyleSheet.create({
    VisionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f8fc'
    },
    VisionLayout: {
        justifyContent: 'center',
        backgroundColor: '#012970',
        width: 360,
        height: 280,
        paddingHorizontal: 20,
        paddingVertical: 70,
        borderRadius: 20,
        marginTop: -30
    },
    HeadlineText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    ContentText: {
        color: '#fff',
    },
});

const subContentStyle = StyleSheet.create({
    subContentLayout: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 360,
        height: 280,
        paddingHorizontal: 20,
        paddingVertical: 40,
        borderRadius: 20,
        marginTop: 5

    },
    HeadlineText: {
        fontSize: 32,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    ContentText: {
        color: 'gray',
        textAlign: 'center'
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 100
    },
});
