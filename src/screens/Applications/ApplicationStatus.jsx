import React, { useState } from "react";
import { View, StyleSheet, Dimensions, useWindowDimensions, ScrollView } from "react-native";
import { Appbar, Card, Text, Button, Chip, Divider } from "react-native-paper";
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { addCommasToNumber } from "../../../utils/currencyFormat";
import { fDate } from "../../../utils/formatTime";
import { MaterialIcons } from "@expo/vector-icons";
import { Badge } from 'react-native-elements';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const ApplicationStatus = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const application = params?.job || {};
    const job = application.job || {};
    const { width: contentWidth } = useWindowDimensions();
    const windowWidth = Dimensions.get('window').width;
    const maxWidth = Math.min(windowWidth, 768);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'description', title: 'Description' },
        { key: 'jobsummary', title: 'Job Summary' },
        { key: 'jobskills', title: 'Skills' },
        { key: 'jobchedules', title: 'Schedules' },
        { key: 'questions', title: 'Questions' },
    ]);

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

    const Description = () => (
        <ScrollView>
            <View style={styles.tabContent}>
                <Text style={styles.headerTitle}>Description</Text>
                <RenderHtml
                    contentWidth={contentWidth}
                    source={{ html: `<div style="text-align: justify;">${job?.description}</div>` }}
                // tagsStyles={{ div: { textAlign: 'justify' } }}
                />
            </View>
        </ScrollView>
    );


    const JobSummaryRoute = () => (
        <ScrollView>
            <View style={styles.tabContent}>
                <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Job Summary</Text>

                <View style={{ paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
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
                            </View>
                            <View>
                                <Text style={styles.jobPosition}>Job Position</Text>
                                <Text style={styles.jobTitle}>{job?.title}</Text>
                            </View>
                            <View>
                                <Text style={styles.jobPosition}>Vacancy</Text>
                                <Text style={styles.jobTitle}>{job?.max_applicant} vacant</Text>
                            </View>
                            {/* {job.schedules && job.schedules.length > 0 && (
                                <View>
                                    <Text style={styles.jobPosition}>Shift and Schedule</Text>
                                    {job.schedules.map((schedule, index) => (
                                        <Text key={index} style={styles.jobTitle}>{schedule}</Text>
                                    ))}
                                </View>
                            )} */}
                        </View>
                        <View style={{ right: 50 }}>
                            <View>
                                <Text style={styles.jobPosition}>Job Work Place</Text>
                                <Text style={styles.jobTitle}>{job?.workplace}</Text>
                            </View>

                            <View>
                                <Text style={styles.jobPosition}>Job Type</Text>
                                <Text style={styles.jobTitle}>{job?.type}</Text>
                            </View>
                            <View>
                                <Text style={styles.jobPosition}>Location</Text>
                                <Text style={styles.jobTitle}>{job?.location}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>
    );

    const JobSkillsRoute = () => (
        <ScrollView>
            <View style={styles.tabContent}>
                <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Skills</Text>
                <View style={{ paddingHorizontal: 10 }}>
                    <View>
                        {/* <Text style={styles.jobPosition}>Job Skills</Text> */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {job.skills && job.skills.length > 0 ? (
                                job.skills.map((skill, index) => (
                                    <Chip key={index} mode="outlined" style={styles.skillChip} textStyle={{
                                        minHeight: 15,
                                        lineHeight: 15,
                                        marginRight: 15,
                                        marginLeft: 15,
                                        marginVertical: 5,
                                        fontSize: 12
                                    }}>{skill.skill_name}</Chip>
                                ))
                            ) : (
                                <Text style={styles.jobTitle}>No categories available</Text>
                            )}
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>


    );

    const JobSchedulesRoute = () => (
        <ScrollView>
            <View style={styles.tabContent}>
                <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Job Schedule</Text>
                <View style={{ paddingHorizontal: 10 }}>
                    {job.schedules && job.schedules.length > 0 && (
                        <View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {job.schedules.map((schedule, index) => (
                                    <Chip
                                        key={index}
                                        mode="outlined"
                                        style={styles.skillChip}
                                        textStyle={{
                                            minHeight: 15,
                                            lineHeight: 15,
                                            marginRight: 15,
                                            marginLeft: 15,
                                            marginVertical: 5,
                                            fontSize: 12
                                        }}
                                    >
                                        {schedule}
                                    </Chip>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

            </View>
        </ScrollView>


    );


    const QuestionsRoute = () => {

        const mapBooleanToYesNo = (value) => {
            return value ? 'Yes' : 'No';
        };

        return (
            <ScrollView>
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
            </ScrollView>
        );
    };

    const renderScene = SceneMap({
        description: Description,
        questions: QuestionsRoute,
        jobsummary: JobSummaryRoute,
        jobskills: JobSkillsRoute,
        jobchedules: JobSchedulesRoute,
    });

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
                            <Text variant='titleLarge' style={{ fontWeight: 'bold', color: '#0A3480' }}>{job.company}</Text>
                            <Text style={{ color: 'gray' }} variant="labelSmall"> Posted {job.created_at ? fDate(job.created_at) : 'n/a'}</Text>
                        </View>

                        <View style={{ flexGrow: 1, backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
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
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: contentWidth }}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: '#0A3480' }}
                            style={{ backgroundColor: 'white', elevation: 0 }}
                            labelStyle={{ color: '#0A3480', fontWeight: 'bold', fontSize: 12 }}
                            tabStyle={{ height: 45 }}
                            scrollEnabled={true}
                        />
                    )}
                />
            </View>
        </View>
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
        width: '100%',
        borderRadius: 0,
    },
    cardContent: {
        paddingHorizontal: 8,
        paddingVertical: 15,
        gap: 5
    },
    tabContent: {
        flex: 1,
        padding: 20
    },
    headerTitle: { fontWeight: 'bold', fontSize: 16 },
    description: { fontSize: 14 },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
    },
    skillChip: {
        marginRight: 10,
        marginBottom: 5,
        fontSize: 12,
        borderRadius: 50
    },
    centeredChip: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    chipText: { fontWeight: 'bold' },
    questionContainer: {
        marginBottom: 10,
    },
    questionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#393939'
    },
    answerText: {
        marginTop: 5,
        paddingHorizontal: 30,
    },
    jobPosition: {
        color: 'gray',
        marginBottom: 5,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0A3480'
    },
});

export default ApplicationStatus;
