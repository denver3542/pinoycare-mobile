import React, { useState } from "react";
import { View, StyleSheet, Dimensions, useWindowDimensions, ScrollView } from "react-native";
import { Appbar, Card, Text, Button, Chip, Divider } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { addCommasToNumber } from "../../../utils/currencyFormat";
import { fDate } from "../../../utils/formatTime";
import { MaterialIcons } from "@expo/vector-icons";
import { Badge } from 'react-native-elements';


const ApplicationStatus = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const application = params?.job || {};
    const job = application.job || {};
    const { width: contentWidth } = useWindowDimensions();
    const windowWidth = Dimensions.get('window').width;
    const maxWidth = Math.min(windowWidth, 768);
    const imageHeight = maxWidth * 0.5;
    const [index, setIndex] = useState(0);

    const formatSalary = (salary) => {
        if (!salary) return 'n/a';
        return `₱${(salary / 1000).toFixed(0)}k`;
    };

    const getBadgeColor = (status) => {
        switch (status) {
            case 'processing':
                return '#E1ECFF';
            case 'interview':
                return '#DBF8F9';
            case 'hired':
                return '#E9FBEF';
            case 'rejected':
                return '#FEEAEA';
            default:
                return 'gray';
        }
    };

    const getBadgeTextColor = (status) => {
        switch (status) {
            case 'processing':
                return '#5690FD';
            case 'interview':
                return '#1CA4AA';
            case 'hired':
                return '#08BE75';
            case 'rejected':
                return '#F85D5B';
            default:
                return 'black';
        }
    };



    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Application Summary" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            {job.media && job.media[0] && job.media[0].original_url && (
                <Card style={styles.card}>
                    <Card.Cover
                        source={{ uri: job.media[0].original_url }}
                        resizeMode="cover"
                        style={[styles.image, { borderRadius: 0 }]}
                    />
                </Card>
            )}
            <View style={styles.contentWrapper}>
                <View style={styles.card}>
                    <View style={{ top: 0 }}>
                        <View style={[styles.cardContent, { alignItems: 'center' }]}>
                            <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>{job.title}</Text>
                            <Text variant='titleLarge' style={{ fontWeight: 'bold', color: '#5690FD' }}>{job.company}</Text>
                            <Text style={{ color: 'gray' }} variant="labelSmall"> Posted {job.created_at ? fDate(job.created_at) : 'n/a'}</Text>
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}><MaterialIcons name="location-on" size={18} color='#0A3480'></MaterialIcons>
                                <Text style={{ color: 'gray' }} variant="labelSmall">{job?.location}</Text>
                            </View> */}
                        </View>
                        {/* <View style={{ paddingHorizontal: 15 }}>
                            <Divider style={{ height: 1 }} />
                        </View> */}

                        <View style={{ flexGrow: 1, backgroundColor: '#fff', borderRadius: 14, padding: 20 }}>
                            <View style={{ flexGrow: 1, paddingVertical: 0, flexGrow: 1, gap: 10 }}>
                                <View style={{ padding: 0, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text variant="titleMedium">Your Application Status</Text>
                                </View>
                                <Badge
                                    value={application.status || 'n/a'}
                                    badgeStyle={[styles.appliedStatusBadge, {
                                        backgroundColor: getBadgeColor(application.status),
                                        borderRadius: 4,
                                        width: '100%',
                                        height: 30,
                                        borderRadius: 10
                                    }]}
                                    textStyle={[styles.chipText, { color: getBadgeTextColor(application.status) }]}
                                />
                            </View>
                        </View>
                    </View>
                </View>

            </View>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        padding: 8,
        backgroundColor: "#F4F7FB",
        flex: 1
    },
    card: {
        width: '100%',
        borderRadius: 0,
    },
    cardContent: {
        paddingHorizontal: 8,
        paddingVertical: 15,
        gap: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 8,
        height: 30
    },
    activeButton: {
        backgroundColor: '#0A3480',
    },
    buttonLabel: {
        fontSize: 12,
        minHeight: 12,
        lineHeight: 12,
        marginRight: 10,
        marginLeft: 10,
        marginVertical: 9
    },
    tabContent: {
        flex: 1,
        marginTop: 5,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
    },
    skillChip: {
        margin: 2,
        fontSize: 12,
        borderRadius: 5
    },
    centeredChip: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    chipText: { fontWeight: 'bold' }
});

export default ApplicationStatus;
