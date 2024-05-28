import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Platform,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Appbar,
  IconButton,
  Searchbar,
  Paragraph,
  useTheme,
  Button,
  Portal,
  Modal,
} from "react-native-paper";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import useJobs from "./hooks/useJobs";
import Job from "./Job";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import HTMLView from "react-native-htmlview";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const GuestJobs = () => {
  const { colors } = useTheme();
  const { data, isLoading, isFetching, isRefetching, refetch } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [descriptionVisibility, setDescriptionVisibility] = useState({});

  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredJobs = data?.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDescriptionVisibility = (jobId) => {
    setDescriptionVisibility((prevVisibility) => ({
      ...prevVisibility,
      [jobId]: !prevVisibility[jobId],
    }));
  };

  const showModal = (jobId) => {
    if (favoriteJobs.includes(jobId)) {
      setFavoriteJobs(favoriteJobs.filter((id) => id !== jobId));
    } else {
      setFavoriteJobs([...favoriteJobs, jobId]);
      // Show the apply modal
      setShowApplyModal(true);
    }
  };

  const truncateDescription = (description, jobId, limit = 150) => {
    if (description.length <= limit || descriptionVisibility[jobId]) {
      return description;
    }
    return description.slice(0, limit) + "...";
  };

  const applyForJob = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const signIn = () => {
    setShowApplyModal(false);
    navigation.navigate("Login");
  };
  const closeModal = () => {
    setShowApplyModal(false);
  };

  const renderJobItem = ({ item }) => {
    const postedDate = moment(item.date_posted).format("LL");
    const navigateToJobDetails = () => {
      showModal(item.id);
    };

    return (
      <TouchableWithoutFeedback onPress={navigateToJobDetails}>
        {job(item)}
      </TouchableWithoutFeedback>
    );
  };

  const job = (job) => {
    const descriptionLimit = 150;
    const isTruncated = job.description.length > descriptionLimit;

    const postedDate = moment(job.date_posted).format("LL");

    return (
      <View style={styles.card}>
        <View style={styles.cardContentRow}>
          {job.media && job.media.length > 0 && job.media[0].original_url ? (
            <Image
              source={{ uri: job.media[0].original_url }}
              style={styles.jobImage}
            />
          ) : (
            <View style={styles.placeholderCard} />
          )}
          <View style={styles.cardContentText}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.title}>{job.title}</Text>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.postedDate}>
                  Posted {moment(job.created_at).fromNow()}
                </Text>
              </View>
              <TouchableWithoutFeedback onPress={() => showModal(job.id)}>
                <MaterialIcons
                  name="favorite-border"
                  size={24}
                  color="#0A3480"
                />
              </TouchableWithoutFeedback>
            </View>
            <Paragraph style={styles.location}>
              <MaterialIcons name="location-on" size={14} color="#0A3480" />
              {` ${job.location}`}
            </Paragraph>

            <HTMLView
              value={truncateDescription(
                job.description,
                job.id,
                descriptionLimit
              )}
              stylesheet={styles.htmlStyles}
            />
            {isTruncated && (
              <TouchableWithoutFeedback
                onPress={() => toggleDescriptionVisibility(job.id)}
              >
                <Text style={styles.readMore}>
                  {descriptionVisibility[job.id] ? "" : "Read more"}
                </Text>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Spinner isLoading={isLoading} />}

      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Searchbar
            placeholder="Search job"
            onChangeText={onChangeSearch}
            value={searchQuery}
            inputStyle={{ paddingVertical: 8, bottom: 8, fontSize: 14 }}
            placeholderTextColor="gray"
            style={
              Platform.OS === "ios" ? styles.iosSearchBar : styles.searchBar
            }
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      />
      <Portal>
        <Modal
          visible={showApplyModal}
          onDismiss={() => setShowApplyModal(false)}
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
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    borderRadius: 100,
    height: 40,
    backgroundColor: "#E5E5EA",
    marginVertical: 8,
  },
  iosSearchBar: {
    flex: 1,
    borderRadius: 8,
    height: 40,
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 0,
    marginVertical: 8,
  },
  listContainer: {
    padding: 10,
    paddingTop: 0,
  },
  card: {
    marginBottom: 8,
    backgroundColor: "white",
    paddingVertical: 8,
    borderRadius: 8,
  },
  textContainer: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  company: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },
  JobContent: {
    flexDirection: "column",
    marginTop: 20,
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 5,
  },
  cardContentRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardContentText: {
    flex: 1,
    marginLeft: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  readMore: {
    color: "#0A3480",
    fontWeight: "bold",
  },
  htmlStyles: {
    flex: 1,
  },
  postedDate: {
    marginBottom: 4,
    color: "#888",
    fontSize: 12,
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
});

export default GuestJobs;
