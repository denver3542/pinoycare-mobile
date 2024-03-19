import React, { useState, useMemo, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Appbar } from "react-native-paper";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HTMLView from "react-native-htmlview";
import { Dialog, Portal, Button } from "react-native-paper";
import { updateApplicationStatus } from "./hook/useJobs";

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

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Job Details" />
      </Appbar.Header>
      <JobCard job={job} postedDate={postedDate} />

      <Tab.Navigator
        initialRouteName="Applicants"
        screenOptions={{ lazy: true }}
      >
        <Tab.Screen
          name="Applicants"
          children={() => <ApplicantsTab applicants={job.application} />}
        />
        <Tab.Screen
          name="Offers"
          children={() => <OffersTab offers={job.offer} />}
        />
      </Tab.Navigator>
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
        {/* {job.description?.replace(/<\/?[^>]+(>|$)/g, "")}{" "} */}

        <HTMLView value={job.description} style={styles.description} />
        {/* Removing HTML tags for simplicity */}
      </Paragraph>
      <Paragraph style={styles.datePosted}>Posted on {postedDate}</Paragraph>
    </Card.Content>
  </Card>
);

const ApplicantList = ({ applicants }) => {
  const [visible, setVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const showDialog = (applicant) => {
    setSelectedApplicant(applicant);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const updateStatus = (newStatus) => {
    // Here you would normally update the status in your state and backend
    const update = updateApplicationStatus(selectedApplicant.id, newStatus);

    console.log(update);
    hideDialog();
  };
  return (
    <>
      <ScrollView style={styles.listScrollView}>
        {applicants.map((application) => (
          <View key={application.uuid} style={styles.applicantCard}>
            <Text style={styles.applicantName}>
              {application.applicant.name}
            </Text>
            <Text style={styles.applicantInfo}>
              Profession: {application.applicant.profession}
            </Text>
            <Text style={styles.applicantInfo}>
              Status: {application.status}
            </Text>
            <Text style={styles.applicantInfo}>
              Preferred Rate: ₱
              {parseFloat(
                application.applicant.preferred_rate
              ).toLocaleString()}
            </Text>
            <Button onPress={() => showDialog(application)}>Edit Status</Button>
          </View>
        ))}
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Change Status</Dialog.Title>
          <Dialog.Content>
            {/* Add buttons or a list here for selecting a new status */}
            <Button onPress={() => updateStatus("Interview")}>Interview</Button>
            <Button onPress={() => updateStatus("Hired")}>Hired</Button>
            <Button onPress={() => updateStatus("Rejected")}>Rejected</Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const OfferedList = ({ offers }) => {
  return (
    <ScrollView style={styles.listScrollView}>
      {offers.map((offer) => (
        <View key={offer.id} style={styles.applicantCard}>
          <Text style={styles.applicantName}>{offer.user_offered_to.name}</Text>
          <Text style={styles.applicantInfo}>
            Profession: {offer.user_offered_to.profession}
          </Text>
          <Text style={styles.applicantInfo}>Status: {offer.status}</Text>
          <Text style={styles.applicantInfo}>
            Preferred Rate: ₱
            {parseFloat(offer.user_offered_to.preferred_rate).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const ApplicantsTab = ({ applicants }) => (
  <ScrollView contentContainerStyle={styles.tabContent}>
    <ApplicantList applicants={applicants} />
  </ScrollView>
);

const OffersTab = ({ offers }) => (
  <ScrollView contentContainerStyle={styles.tabContent}>
    <OfferedList offers={offers} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light grey background for contrast
  },
  card: {
    margin: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF", // White background for cards
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333", // Dark grey for text for better readability
  },
  company: {
    fontSize: 20,
    color: "#666666",
  },
  details: {
    fontSize: 18,
    color: "#666666",
  },
  salary: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  description: {
    fontSize: 16,
    color: "#666666",
  },
  datePosted: {
    fontSize: 14,
    color: "#757575",
  },
  listScrollView: {
    paddingHorizontal: 8, // Add some padding around the scroll view
  },
  applicantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  applicantInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    marginTop: 5,
  },
});

export default JobDetailsScreen;
