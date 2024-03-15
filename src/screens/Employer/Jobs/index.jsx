import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Card, Title, Paragraph, useTheme, Appbar } from "react-native-paper";
import moment from "moment"; // Make sure to install moment for date formatting
import useJobs from "./hook/useJobs";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const PostedJobsScreen = () => {
  const { colors } = useTheme();
  const { data: jobs, isFetching, isFetched } = useJobs();
  const navigation = useNavigation();

  const renderJob = ({ item }) => {
    const postedDate = moment(item.date_posted).format("LL");
    const numberOfApplicants = item.offer.length; // Assuming 'offer' contains applicants
    const numberOfProfessionalsOfferedTo = item.max_applicant; // Total professionals offered the job
    const navigateToJobDetails = () => {
      navigation.navigate("JobDetails", { job: item });
    };

    return (
      <Card style={styles.card} elevation={4} onPress={navigateToJobDetails}>
        <Card.Content>
          <Title style={styles.jobTitle}>{item.title}</Title>
          <Paragraph style={styles.company}>{item.company}</Paragraph>
          <Paragraph style={styles.details}>
            {item.location} • {item.type}
          </Paragraph>
          <Paragraph
            style={[
              styles.salary,
              {
                color: "#2E7D32",
              },
            ]}
          >
            ₱{parseFloat(item.salary_from).toLocaleString()} - ₱
            {parseFloat(item.salary_to).toLocaleString()}
          </Paragraph>
          <Paragraph style={[styles.datePosted, { color: colors.accent }]}>
            Posted on {postedDate}
          </Paragraph>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Applicants: {numberOfApplicants}
            </Text>
            <Text style={styles.statsText}>
              Offered To: {numberOfProfessionalsOfferedTo}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="JOBS POSTED" />
      </Appbar.Header>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  company: {
    fontSize: 16,
    marginBottom: 4,
    color: "#37474F",
  },
  details: {
    fontSize: 14,
    color: "#62727B",
    marginBottom: 4,
  },
  salary: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  datePosted: {
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsText: {
    fontSize: 14,
    color: "#1B5E20",
  },
});

export default PostedJobsScreen;
