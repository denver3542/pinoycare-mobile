import React, { useEffect, useState } from "react";
import HTMLView from "react-native-htmlview";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  useWindowDimensions,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Appbar,
  Button,
  Card,
  Chip,
  Divider,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { fDate } from "../../../utils/formatTime";
import { addCommasToNumber } from "../../../utils/currencyFormat";
import { useUser } from "../../hooks/useUser";
import useJob from "../../screens/User/Jobs/hook/useJobs";
import { useQueryClient } from "@tanstack/react-query";
import { MaterialIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import JobMatching from "../User/Jobs/jobMatching";

export default function Job() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const job = params?.job || {};
  const navigation = useNavigation();
  const { user, isFetched } = useUser();
  const [isApplied, setIsApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [questions, setQuestions] = useState([]);
  const { data: jobData, isFetching, refetch } = useJob(job.uuid);
  const [refreshing, setRefreshing] = useState(false);
  const { width: contentWidth } = useWindowDimensions();
  const windowWidth = Dimensions.get("window").width;
  const maxWidth = Math.min(windowWidth, 768);
  const imageHeight = (maxWidth * 9) / 10;
  const queryClient = useQueryClient();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const truncatedDescriptionLength = 150;

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const renderDescription = () => {
    if (!job?.description) return "";

    const truncatedDescription = job.description.substring(
      0,
      truncatedDescriptionLength
    );
    const shouldShowMore = job.description.length > truncatedDescriptionLength;
    const descriptionToShow = isDescriptionExpanded
      ? job.description
      : `${truncatedDescription}${shouldShowMore ? "..." : ""}`;

    return (
      <RenderHtml
        contentWidth={contentWidth}
        source={{
          html: `<div style="text-align: justify;">${descriptionToShow}</div>`,
        }}
      />
    );
  };

  const formatSalary = (salary) => {
    if (!salary) return "n/a";
    return `${(salary / 1000).toFixed(0)}k`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (user && isFetched) {
      // console.log("User data:", user);
      // console.log("Job data:", job);

      const appliedJob = job.application?.find(
        (app) => app.user_id === user.id
      );
      setIsApplied(!!appliedJob);
      setApplicationStatus(appliedJob ? appliedJob.status : null);

      if (appliedJob) {
        console.log(`User has an application for the job with ID ${job.id}`);
        console.log(`Application status: ${appliedJob.status}`);
      } else {
        console.log(
          `User does not have an application for the job with ID ${job.id}`
        );
      }

      console.log(
        `Checking application for job with ID ${job.id}: ${
          appliedJob ? "Application found" : "No application found"
        }`
      );
    }
  }, [user, isFetched, job]);

  useEffect(() => {
    if (job && !isFetching) {
      setQuestions(job.question || []);
    }
  }, [job, isFetching]);

  const handleSave = () => {
    showModal(true);
  };

  const handleApply = () => {
    if (!user) {
      setShowApplyModal(true);
    } else {
      navigation.navigate("Questionnaire", { job });
    }
  };

  const signIn = () => {
    navigation.navigate("Login");
    closeModal();
  };

  const closeModal = () => {
    setShowSaveModal(false);
    setShowApplyModal(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
    >
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        {/* <Appbar.Content title={job.title || "Job Details"} titleStyle={{ color: 'white' }} /> */}
      </Appbar.Header>
      {job.media && job.media[0] && job.media[0].original_url && (
        <Card.Cover
          source={{ uri: job.media[0].original_url }}
          resizeMode="stretch"
          style={[styles.image, { borderRadius: 0, height: 400 }]}
        />
      )}
      <View style={styles.contentWrapper}>
        <View style={styles.card}>
          <View style={[styles.cardContent, { alignItems: "center" }]}>
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {job.title}
            </Text>
            <Text
              variant="titleLarge"
              style={{
                fontWeight: "bold",
                color: "#5690FD",
                textAlign: "center",
              }}
            >
              {job.company}
            </Text>
            <Text style={{ color: "gray" }} variant="labelSmall">
              {" "}
              Posted {job.created_at ? fDate(job.created_at) : "n/a"}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              paddingVertical: 20,
              borderWidth: 0.5,
              borderColor: "#ddd",
            }}
          >
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "#EEF4FF",
                    padding: 15,
                    borderRadius: 100,
                  }}
                >
                  <MaterialIcons
                    name="work"
                    size={25}
                    color="#5690FD"
                  ></MaterialIcons>
                </View>
                <View style={{ marginTop: 4, alignItems: "center", gap: 2 }}>
                  <Text variant="labelMedium" style={{ color: "gray" }}>
                    Type
                  </Text>
                  <Text variant="labelMedium" style={{ color: "#414141" }}>
                    {job.type}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "#DBFFEC",
                    padding: 15,
                    borderRadius: 100,
                  }}
                >
                  <MaterialIcons
                    name="attach-money"
                    size={25}
                    color="#00D261"
                  ></MaterialIcons>
                </View>
                <View style={{ marginTop: 4, alignItems: "center", gap: 2 }}>
                  <Text variant="labelMedium" style={{ color: "gray" }}>
                    Salary
                  </Text>
                  <Text variant="labelMedium" style={{ color: "#414141" }}>
                    {job.currency} {formatSalary(job.salary_from)} -{" "}
                    {formatSalary(job.salary_to)} / {job.rate_type}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "#FFDBDB",
                    padding: 15,
                    borderRadius: 100,
                  }}
                >
                  <MaterialIcons
                    name="location-on"
                    size={25}
                    color="#FF4C4C"
                  ></MaterialIcons>
                </View>
                <View style={{ marginTop: 4, alignItems: "center", gap: 2 }}>
                  <Text variant="labelMedium" style={{ color: "gray" }}>
                    Work Place
                  </Text>
                  <Text variant="labelMedium" style={{ color: "#414141" }}>
                    {job.workplace}
                  </Text>
                </View>
              </View>
            </View>
            {/* <Divider style={{ margin: 20 }} />

            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
              <JobMatching rating={job.matchScore / 25} />
            </View> */}
          </View>

          <View style={[styles.cardContent]}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Description
            </Text>

            {renderDescription()}
            {job?.description?.length > truncatedDescriptionLength && (
              <TouchableOpacity onPress={toggleDescription}>
                <Text style={{ fontWeight: "700", color: "#0A3480" }}>
                  {isDescriptionExpanded ? "Read Less" : "Read More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.cardContent]}>
            <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 18 }}>
              Skills
            </Text>
            <View style={{ paddingHorizontal: 0 }}>
              <View style={styles.chipContainer}>
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((item) => (
                    <Chip
                      key={item.id}
                      textStyle={{
                        minHeight: 14,
                        lineHeight: 14,
                        marginRight: 10,
                        marginLeft: 10,
                        marginVertical: 5,
                        fontSize: 14,
                      }}
                      style={styles.skillChip}
                    >
                      <Text>{item.skill_name}</Text>
                    </Chip>
                  ))
                ) : (
                  <Text>No Skills Required</Text>
                )}
              </View>
            </View>
          </View>
          <View style={[styles.cardContent]}>
            <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 18 }}>
              Shift and Schedule
            </Text>
            <View style={{ paddingHorizontal: 0 }}>
              <View style={styles.chipContainer}>
                {job.schedules && job.schedules.length > 0 ? (
                  job.schedules.map((schedule, index) => (
                    <Chip
                      key={index}
                      textStyle={{
                        minHeight: 14,
                        lineHeight: 14,
                        marginRight: 10,
                        marginLeft: 10,
                        marginVertical: 5,
                        fontSize: 14,
                      }}
                      style={styles.skillChip}
                    >
                      <Text>{schedule}</Text>
                    </Chip>
                  ))
                ) : (
                  <Text>No Schedule Details</Text>
                )}
              </View>
            </View>
          </View>

          <View style={[styles.cardContent]}>
            <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 18 }}>
              Vacancy
            </Text>
            <View style={{ paddingHorizontal: 0 }}>
              <View style={styles.chipContainer}>
                <Chip
                  textStyle={{
                    minHeight: 14,
                    lineHeight: 14,
                    marginRight: 10,
                    marginLeft: 10,
                    marginVertical: 5,
                    fontSize: 14,
                  }}
                  style={styles.skillChip}
                >
                  <Text>{job.max_applicant ?? "n/a"} vacant</Text>
                </Chip>
              </View>
            </View>
          </View>

          <View style={[styles.cardContent]}>
            <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 18 }}>
              Match
            </Text>
            <View style={{ paddingHorizontal: 0 }}>
              <JobMatching rating={job.matchScore / 25} />
            </View>
          </View>
        </View>
      </View>
      <Divider style={{ marginVertical: 10 }} />
      <View style={{ marginHorizontal: 10 }}>
        {!user && !isFetched && (
          <Button icon="" style={styles.saveButton} onPress={handleSave}>
            Save
          </Button>
        )}
        <Button
          mode="contained"
          style={[{ color: isApplied ? "#fff" : "primary" }]}
          onPress={handleApply}
          disabled={isApplied}
        >
          {isApplied ? "Applied" : "Apply"}
        </Button>
      </View>
      <Portal>
        <Modal
          visible={showSaveModal}
          onDismiss={() => setShowSaveModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalText}>
            Would you like to save this job? Please sign in.
          </Text>
          <Button onPress={signIn} mode="contained">
            Sign In
          </Button>
          <Button onPress={closeModal} mode="text" style={styles.button}>
            Cancel
          </Button>
        </Modal>
        <Modal
          visible={showApplyModal}
          onDismiss={() => setShowApplyModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalText}>
            Would you like to apply for this job? Please sign in.
          </Text>
          <Button onPress={signIn} mode="contained">
            Sign In
          </Button>
          <Button onPress={closeModal} mode="text" style={styles.button}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    flex: 1,
  },

  cardContent: {
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "#F4F7FB",
  },
  card: {
    width: "100%",
    borderRadius: 0,
    margin: 5,
    backgroundColor: "#F4F7FB",
  },
  saveButton: {},
  applyButton: {
    backgroundColor: "#0A3480",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  company: {
    fontSize: 16,
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 5,
  },
  divider: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    marginTop: 5,
    textAlign: "justify",
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 0,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    margin: 2,
  },
  a: {
    fontWeight: "300",
    color: "red",
  },
});
