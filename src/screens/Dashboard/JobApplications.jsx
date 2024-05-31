import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import logo from "../../../assets/images/hero-bg.jpg";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useDashboard } from "../Dashboard/hooks/useDashboard"; // Update the path

const JobApplications = ({ application }) => {
    const navigation = useNavigation();
    const { data: dashboardData } = useDashboard();

    if (!application || !application.job || !dashboardData) {
        return null;
    }

    const { job } = application;
    const { title, company, media } = job;
    const applicationStatus = getApplicationStatus(dashboardData.applications, job.id);

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
                            <Text style={styles.appliedProfession}>{title || 'n/a'}</Text>
                            <Text style={styles.appliedCompany}>{company || 'n/a'}</Text>
                            <Text style={styles.appliedStatus}>{applicationStatus || 'n/a'}</Text>
                        </View>
                        <Icon source="chevron-right" size={25} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flexGrow: 1,
        padding: 8,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    appliedProfession: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    appliedCompany: {
        fontSize: 14,
    },
    appliedStatus: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    jobImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 15,
    },
    applicationDetails: {
        flex: 1,
    },
});

export default JobApplications;
