import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Appbar,
  Button,
  Card,
  Chip,
  Modal,
  Portal,
  Text,
  useTheme,
  Divider,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import JobMatching from "../User/Jobs/jobMatching";
import { fDate } from "../../../utils/formatTime";
import { addCommasToNumber } from "../../../utils/currencyFormat";
import { useUser } from "../../hooks/useUser";
import useJob from "../../screens/User/Jobs/hook/useJobs";
import { useQueryClient } from "@tanstack/react-query";

export default function Job() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const job = params?.job || {};
  const navigation = useNavigation();
  const { user, isFetched } = useUser();
  const [isApplied, setIsApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
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

  const toggleDescription = useCallback(() => {
    setIsDescriptionExpanded((prevState) => !prevState);
  }, []);

  const { width } = useWindowDimensions();

  const source = {
    html: job?.description,
  };

  const renderDescription = () => {
    if (!job?.description) return null;

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
          html: `<p style="text-align: justify;">${descriptionToShow}</p>`,
        }}
        tagsStyles={{
          p: { margin: 0, padding: 0, textAlign: "justify" },
        }}
      />
    );
  };

  const formatSalary = (from, to, currency) => {
    return `${currency} ${parseFloat(from).toLocaleString()} - ${parseFloat(
      to
    ).toLocaleString()}`;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  useEffect(() => {
    if (user && isFetched) {
      const appliedJob = job.application?.find(
        (app) => app.user_id === user.id
      );
      setIsApplied(!!appliedJob);
      setApplicationStatus(appliedJob ? appliedJob.status : null);
    }
  }, [user, isFetched, job]);

  const handleSave = useCallback(() => setShowSaveModal(true), []);
  const handleApply = useCallback(() => {
    if (!user) {
      setShowApplyModal(true);
    } else {
      navigation.navigate("Questionnaire", { job });
    }
  }, [user, job, navigation]);

  const signIn = useCallback(() => {
    navigation.navigate("Login");
    closeModal();
  }, [navigation]);

  const closeModal = useCallback(() => {
    setShowSaveModal(false);
    setShowApplyModal(false);
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        {/* <Appbar.Content title={job.title || "Job Details"} titleStyle={{ color: 'white' }} /> */}
      </Appbar.Header>
      {job.media && job.media[0] && job.media[0].original_url ? (
        <Card.Cover
          source={{ uri: job.media[0].original_url }}
          resizeMode="stretch"
          style={[styles.image, { borderRadius: 0, height: 450 }]}
        />
      ) : (
        <Card.Cover
          source={{ uri: "https://via.placeholder.com/150" }}
          resizeMode="stretch"
          style={[styles.image, { borderRadius: 0, height: 450 }]}
        />
      )}

      <View style={styles.contentWrapper}>
        <View style={styles.card}>
          <View
            style={[styles.cardContent, { alignItems: "center", margin: 8 }]}
          >
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {job.title}
            </Text>
             <Text
                           variant="titleLarge"
                           style={{ fontWeight: "bold", color: "#0A3480" }}
                           numberOfLines={1}
                         >
              {job.creator.name}
            </Text>
            <Text style={{ color: "gray" }} variant="labelSmall">
              {" "}
              Posted {job.created_at ? fDate(job.created_at) : ""}
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
                    {formatSalary(job.salary_from, job.salary_to, job.currency)}{" "}
                    / {job.rate_type}
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

          <View style={[styles.cardContent, { gap: 5 }]}>
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
                    <Text
                      key={item.id}
                      style={{
                        marginVertical: 2,
                        marginHorizontal: 0,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: "#ddd",
                      }}
                    >
                      {item.skill_name}
                    </Text>
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
                    <Text
                      key={index}
                      style={{
                        marginVertical: 2,
                        marginHorizontal: 0,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: "#ddd",
                        //   color: "black",
                      }}
                    >
                      {schedule}
                    </Text>
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
              <View style={styles.chipStyle}>
                <Text
                  style={{
                    marginVertical: 2,
                    marginHorizontal: 0,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: "#ddd",
                    //   color: "black",
                  }}
                >
                  {job.max_applicant === -1 ? "No Limit" : job.max_applicant}
                </Text>
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
    backgroundColor: "#F4F7FB",
    flex: 1,
  },
  card: {
    flex: 1,
  },
  cardContent: {
    paddingHorizontal: 8,
    paddingVertical: 15,
    gap: 5,
  },
  tabContent: {
    width: "100%",
    padding: 15,
    // backgroundColor: 'white',
    marginVertical: 0,
  },
  image: {
    borderRadius: 0,
    height: 400,
    width: "100%",
  },
  skillChip: {
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  jobPosition: {
    fontSize: 12,
    color: "gray",
  },
  jobTitle: {
    fontWeight: "bold",
    fontSize: 13,
  },
  appliedStatusBadge: {
    backgroundColor: "green",
    marginTop: 5,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  answerText: {
    color: "#454545",
    marginHorizontal: 15,
    fontWeight: "700",
  },
});
