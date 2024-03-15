import React, { useState, useMemo, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Appbar } from "react-native-paper";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const JobDetailsScreen = ({ route }) => {
  const { job } = route.params;
  const postedDate = moment(job.date_posted).format("LL");
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();

  const routes = useMemo(
    () => [
      { key: "applicants", title: "Applicants", data: job.application },
      { key: "offers", title: "Offers", data: job.offer },
    ],
    [job.application, job.offer]
  );

  const renderScene = useCallback(({ route }) => {
    return (
      <ScrollView style={styles.tabContent}>
        {route.key === "applicants" ? (
          <ApplicantList applicants={route.data} />
        ) : (
          <></>
        )}
      </ScrollView>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Job Details" />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <JobCard job={job} postedDate={postedDate} />

        <View style={{ flex: 2.2, borderRadius: 8 }}>
          <Tab.Navigator
            initialRouteName="Applicants"
            screenOptions={{ lazy: true }}
          >
            {routes.map(({ key, title }, idx) => (
              <Tab.Screen
                key={key}
                name={title}
                children={() => renderScene({ route: routes[idx] })}
              />
            ))}
          </Tab.Navigator>
        </View>
      </ScrollView>
    </View>
  );
};
const JobCard = ({ job, postedDate }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Title style={styles.title}>{job.title}</Title>
      <Paragraph style={styles.company}>{job.company}</Paragraph>
      <Paragraph style={styles.details}>
        Location: {job.location} • Job Type: {job.type}
      </Paragraph>
      <Paragraph style={styles.salary}>
        Salary: ₱{parseFloat(job.salary_from).toLocaleString()} - ₱
        {parseFloat(job.salary_to).toLocaleString()}
      </Paragraph>
      <Text style={styles.descriptionTitle}>Job Description:</Text>
      <Paragraph style={styles.description}>
        {job.description?.replace(/<\/?[^>]+(>|$)/g, "")}{" "}
        {/* Removing HTML tags for simplicity */}
      </Paragraph>
      <Paragraph style={styles.datePosted}>Posted on {postedDate}</Paragraph>
    </Card.Content>
  </Card>
);

const ApplicantList = ({ applicants }) => {
  return (
    <ScrollView style={styles.listContainer}>
      {applicants.map((application) => (
        <View key={application.uuid} style={styles.applicantItem}>
          <Text style={styles.applicantName}>{application.applicant.name}</Text>
          <Text style={styles.applicantInfo}>
            Profession: {application.applicant.profession}
          </Text>
          <Text style={styles.applicantInfo}>Status: {application.status}</Text>
          <Text style={styles.applicantInfo}>
            Preferred Rate: ₱
            {parseFloat(application.applicant.preferred_rate).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  company: {
    fontSize: 18,
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    marginBottom: 4,
  },
  salary: {
    fontSize: 16,
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  datePosted: {
    fontSize: 14,
    color: "#757575",
  },
});

export default JobDetailsScreen;
