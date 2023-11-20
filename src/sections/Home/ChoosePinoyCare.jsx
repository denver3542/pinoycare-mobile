import React from 'react'
import { Headline, Text, useTheme } from 'react-native-paper';
import { FlatList, Image, StyleSheet, View } from 'react-native';

export default function ChoosePinoyCare() {
    const theme = useTheme();
    return (
        <View style={customStyle.container}>

            <View style={customStyle.innerContainer}>
                <Image
                    source={{ uri: 'https://pinoycareph.com/assets/images/landingicons/icon%204.png' }}
                    style={customStyle.image}
                />
                <View style={{ paddingHorizontal: 20 }}>
                    <Headline style={customStyle.HeadlineText}>Why Choose PinoyCare?</Headline>
                    <Text style={[theme.fonts.bodyLarge, { textAlign: 'center' }]}>Discover, connect, and thrive. Pinoycareph bridges the gap between Filipino professionals and global employers in search of excellence.</Text>
                    <View style={customStyle.subContentLayout}>
                        <Image
                            source={{ uri: 'https://pinoycareph.com/assets/images/landingicons/icon%205.png' }}
                            style={customStyle.SubContentimage}
                        />
                        <Headline style={customStyle.SubContentHeadlineText}>Professional Development</Headline>
                        <Text style={[theme.fonts.bodyLarge, { textAlign: 'center' }]}>Gain access to continuous learning and development opportunities. We support your growth in the medical field.</Text>
                    </View>
                    <View style={customStyle.subContentLayout}>
                        <Image
                            source={{ uri: 'https://pinoycareph.com/assets/images/landingicons/icon%206.png' }}
                            style={customStyle.SubContentimage}
                        />
                        <Headline style={customStyle.SubContentHeadlineText}>Work-Life Balance</Headline>
                        <Text style={[theme.fonts.bodyLarge, { textAlign: 'center' }]}>We value your well-being. Enjoy flexible work schedules and ample vacation days to maintain a healthy work-life balance.</Text>
                    </View>
                    <View style={customStyle.subContentLayout}>
                        <Image
                            source={{ uri: 'https://pinoycareph.com/assets/images/landingicons/icon%207.png' }}
                            style={customStyle.SubContentimage}
                        />
                        <Headline style={customStyle.SubContentHeadlineText}>Career Advancement</Headline>
                        <Text style={[theme.fonts.bodyLarge, { textAlign: 'center' }]}>We encourage internal growth and provide opportunities for career advancement, whether it's climbing the ranks or specializing in a specific medical area.</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const customStyle = StyleSheet.create({
    container: {
        backgroundColor: '#f6f8fc'
    },
    innerContainer: {
        backgroundColor: '#fff',
        marginTop: 20
    },
    image: {
        width: '100%',
        height: 'auto',
        resizeMode: 'contain',
        aspectRatio: 1
    },
    HeadlineText: {
        fontWeight: 'bold',
        paddingBottom: 20,
        textAlign: 'center'
    },
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
    SubContentHeadlineText: {
        fontWeight: 'bold',
        paddingBottom: 20
    },
    SubContentimage: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 100,
    }
});
