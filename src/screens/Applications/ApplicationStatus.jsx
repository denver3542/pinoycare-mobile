import React, { useState } from "react";
import { View, StyleSheet, Dimensions, useWindowDimensions, ScrollView, TouchableOpacity } from "react-native";
import { Appbar, Card, Text, Chip } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { addCommasToNumber } from "../../../utils/currencyFormat";
import { fDate } from "../../../utils/formatTime";
import { Badge } from 'react-native-elements';

const ApplicationStatus = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const application = params?.job || {};
    const job = application.job || {};
    const { width: contentWidth } = useWindowDimensions();
    const windowWidth = Dimensions.get('window').width;
    const maxWidth = Math.min(windowWidth, 768);

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

    const mapBooleanToYesNo = (value) => {
        return value ? 'Yes' : 'No';
    };
    const [readMore, setReadMore] = useState(false);
    const descriptionHtml = readMore
    ? `<div style="text-align: justify;">${job?.description}</div>`
    : `<div style="text-align: justify;">${job?.description?.substring(0, 200)}...</div>`;

    return (
        <ScrollView style={styles.container}  showsVerticalScrollIndicator={false}>
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Application Summary" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <View style={styles.contentWrapper}>
                        {job.media && job.media[0] && job.media[0].original_url && (
                            <Card style={styles.card}>
                                <Card.Cover
                                    source={{ uri: job.media[0].original_url }}
                                    style={[styles.image, { borderRadius: 0, height: 400 }]}
                                />
                            </Card>
                        )}
                <View style={styles.card}>
                    <View style={{ top: 0 }}>
                        <View style={[styles.cardContent, { alignItems: 'center', margin: 8 }]}>
                            <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>{job.title}</Text>
                            <Text variant='titleLarge' style={{ fontWeight: 'bold', color: '#0A3480' }}>{job.company}</Text>
                            <Text style={{ color: 'gray' }} variant="labelSmall"> Posted {job.created_at ? fDate(job.created_at) : 'n/a'}</Text>
                        </View>
                        <View style={{ flexGrow: 1, backgroundColor: '#fff', padding: 20, marginHorizontal: 8 ,  borderRadius: 14, borderTopRightRadius: 14, borderWidth: 0.5,borderColor: '#ddd' }}>
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

                <View style={[styles.tabContent]}>
                    <Text style={styles.headerTitle}>Description</Text>
                    <RenderHtml
                        contentWidth={contentWidth}
                        source={{ html: descriptionHtml }}
                    />
                    <TouchableOpacity onPress={() => setReadMore(!readMore)}>
                        <Text style={{ fontWeight: '700', color:'#0A3480' }}>{readMore ? "Read Less" : "Read More"}
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.tabContent}>
                    <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Job Summary</Text>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View>
                                <Text style={styles.jobPosition}>Job Category</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {job.categories && job.categories.length > 0 ? (
                                        job.categories.map((category, index) => (
                                            <Text key={index} style={styles.jobTitle}>{category.name}</Text>
                                        ))
                                    ) : (
                                        <Text style={styles.jobTitle}>No categories </Text>
                                    )}
                                </View>
                                <Text style={styles.jobPosition}>Job Position</Text>
                                <Text style={styles.jobTitle}>{job?.title}</Text>
                                <Text style={styles.jobPosition}>Vacancy</Text>
                                <Text style={styles.jobTitle}>{job?.max_applicant} vacant</Text>
                            </View>
                            <View style={{ right: 50 }}>
                                <Text style={styles.jobPosition}>Job Work Place</Text>
                                <Text style={styles.jobTitle}>{job?.workplace}</Text>
                                <Text style={styles.jobPosition}>Job Type</Text>
                                <Text style={styles.jobTitle}>{job?.type}</Text>
                                <Text style={styles.jobPosition}>Location</Text>
                                <Text style={styles.jobTitle}>{job?.location}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.tabContent}>
                    <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Skills</Text>
                    <View style={{ paddingHorizontal: 0 }}>
                        <View style={{ flexDirection: 'column' }}>
                            {job.skills && job.skills.length > 0 ? (
                                job.skills.map((skill, index) => (
                                    <Chip key={index}  style={styles.skillChip} textStyle={{
                                        minHeight: 15,
                                        lineHeight: 15,
                                        marginHorizontal: 15,
                                        marginVertical: 5,
                                        fontSize: 13,
                                        flexGrow: 1
                                    }}>{skill.skill_name}</Chip>
                                ))
                            ) : (
                                <Text style={styles.jobTitle}>No categories available</Text>
                            )}
                        </View>
                    </View>
                </View>
                <View style={styles.tabContent}>
                    <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Job Schedule</Text>
                    <View style={{ paddingHorizontal: 10 }}>
                        {job.schedules && job.schedules.length > 0 && (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {job.schedules.map((schedule, index) => (
                                    <Chip
                                        key={index}
                                        mode="flat"
                                        style={styles.skillChip}
                                        textStyle={{
                                            minHeight: 15,
                                        lineHeight: 15,
                                        marginHorizontal: 15,
                                        marginVertical: 5,
                                        fontSize: 12
                                        }}
                                    >
                                        {schedule}
                                    </Chip>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.tabContent}>
                    <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Job Questions</Text>
                    {job.question && job.question.length > 0 ? (
                        job.question.map((question, index) => {
                            const answer = application.answers.find(a => a.job_question_id === question.id);

                            let displayAnswer;
                            if (answer && question.type === 'boolean') {
                                displayAnswer = mapBooleanToYesNo(answer.answer);
                            } else {
                                displayAnswer = answer ? answer.answer : 'No answer provided';
                            }

                            return (
                                <View key={index} style={styles.questionContainer}>
                                    <Text style={styles.questionTitle}>{index + 1}. {question.question}</Text>
                                    <Text style={styles.answerText}>{displayAnswer}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <Text>No questions available</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        backgroundColor: "#F4F7FB",
        flex: 1
    },
    card: {
      flex: 1
    },
    cardContent: {
        paddingHorizontal: 8,
        paddingVertical: 15,
        gap: 5
    },
    tabContent: {
        width: '100%',
        padding: 15,
        // backgroundColor: 'white',
         marginVertical: 0
    },
    image: {
        borderRadius: 0,
        height: 400,
        width: '100%'
    },
    skillChip: {
        marginRight: 5,
        marginBottom: 5,
        borderRadius: 8,
        // backgroundColor: '#F4F4F4',
        borderColor: 'transparent'
    },
    jobPosition: {
        fontSize: 12,
        color: 'gray'
    },
    jobTitle: {
        fontWeight: 'bold',
        fontSize: 13
    },
    appliedStatusBadge: {
        backgroundColor: 'green',
        marginTop: 5
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600'
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    questionContainer: {
        marginBottom: 10
    },
    questionTitle: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    answerText: {
        color: '#454545',
        marginHorizontal: 15,
        fontWeight: '700'
    }
});

export default ApplicationStatus;
