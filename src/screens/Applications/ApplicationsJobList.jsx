import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import logo from "../../../assets/images/hero-bg.jpg";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useDashboard } from "../Dashboard/hooks/useDashboard";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Badge } from 'react-native-elements';

const JobApplicationList = ({ application }) => {
    const navigation = useNavigation();
    const { data: dashboardData } = useDashboard();

    if (!application || !application.job || !dashboardData) {
        return null;
    }

    const { job } = application;
    const { title, company, media } = job;
    const applicationStatus = getApplicationStatus(dashboardData.applications, job.id);
    const badgeColor = getBadgeColor(applicationStatus);
    const badgeTextColor = getBadgeTextColor(applicationStatus);

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Job", application)}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <Image
                            source={{
                                uri: media && media.length > 0 ? media[0].original_url : logo,
                            }}
                            style={styles.jobImage}
                        />
                        <View style={styles.applicationDetails}>
                            <View>
                                <Text style={styles.appliedProfession}>{title || 'n/a'}</Text>
                                <Text style={styles.appliedCompany}>{company || 'n/a'}</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <Badge
                                        value={applicationStatus || 'n/a'}
                                        badgeStyle={[styles.appliedStatusBadge, {
                                            backgroundColor: badgeColor,
                                            paddingVertical: 10,
                                            borderRadius: 4
                                        }]}
                                        textStyle={[styles.chipText, { color: badgeTextColor }]}
                                    />
                                </View>
                            </View>
                            <Icon source="chevron-right" size={25} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const getApplicationStatus = (applications, jobId) => {
    const application = applications.find(app => app.job_id === jobId);
    return application ? application.status : null;
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flexGrow: 1,
        // backgroundColor: "#ffff",
        borderRadius: 12,
        marginBottom: 0,
    },
    cardContent: {
        padding: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    appliedProfession: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    appliedCompany: {
        fontSize: 14,
    },
    appliedStatusBadge: {
        fontSize: 14,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4
    },
    jobImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 15,
    },
    applicationDetails: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chipText: {
        fontWeight: 'bold',
        fontSize: 12,
        minHeight: 12,
        lineHeight: 12,
        marginHorizontal: 12,
        alignItems: "center",
        marginVertical: 4,
    },
});

export default JobApplicationList;
