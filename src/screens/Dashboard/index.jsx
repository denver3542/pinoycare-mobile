import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Modal,
} from "react-native";
import {
  Text,
  Searchbar,
  Divider,
  useTheme,
  Appbar,
  ActivityIndicator,
  Snackbar,
  Button,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "./hooks/useDashboard";
import ApplicationListCard from "../../components/ApplicationListCard";
import JobApplications from "./JobApplications";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HeaderMessageNotification from "../../components/HeaderMessageNotification";
import HeaderNotification from "../../components/HeaderNotification";
import { Swipeable } from "react-native-gesture-handler";

function Dashboard() {
  const { colors } = useTheme();
  const { user } = useUser();
  const {
    data,
    isFetched,
    refetch,
    deleteApplication,
    deleteJobOffer,
    deleteSavedJob,
    deleteError,
  } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [applications, setApplications] = useState([]);
  const [offeredJobs, setOfferedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showMoreOffers, setShowMoreOffers] = useState(false);
  const [showMoreSavedJobs, setShowMoreSavedJobs] = useState(false);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(false);
  const [loadingJobOffers, setLoadingJobOffers] = useState(false);
  const [deletedItem, setDeletedItem] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false); // State for confirmation modal
  const [itemToDelete, setItemToDelete] = useState(null); // State to store item to be deleted

  useEffect(() => {
    if (isFetched) {
      setApplications(data?.applications || []);
      setOfferedJobs(data?.job_offers || []);
      setSavedJobs(data?.saved_jobs || []);
    }
  }, [isFetched, data]);

  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const handleSeeMore = async (type) => {
    if (type === "offers") {
      setLoadingJobOffers(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowMoreOffers(true);
      setLoadingJobOffers(false);
    } else if (type === "savedJobs") {
      setLoadingSavedJobs(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowMoreSavedJobs(true);
      setLoadingSavedJobs(false);
    }
  };

  const handleDelete = (applicationId, type) => {
    let deletedItemData = null;
    if (type === "applications") {
      deletedItemData = applications.find(
        (application) => application.id === applicationId
      );
    } else if (type === "offers") {
      deletedItemData = offeredJobs.find((job) => job.id === applicationId);
    } else if (type === "savedJobs") {
      deletedItemData = savedJobs.find((job) => job.id === applicationId);
    }
    setItemToDelete({ id: applicationId, type, data: deletedItemData });
    setConfirmationVisible(true); // Show confirmation modal
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === "applications") {
        deleteApplication.mutate(itemToDelete.id);
      } else if (itemToDelete.type === "offers") {
        deleteJobOffer.mutate(itemToDelete.id);
      } else if (itemToDelete.type === "savedJobs") {
        deleteSavedJob.mutate(itemToDelete.id);
      }
      setDeletedItem(itemToDelete);
      setConfirmationVisible(false); // Close confirmation modal
      setItemToDelete(null); // Clear item to delete state
    }
  };

  const undoDelete = () => {
    if (deletedItem) {
      if (deletedItem.type === "applications") {
        setApplications((prev) => [deletedItem.data, ...prev]);
      } else if (deletedItem.type === "offers") {
        setOfferedJobs((prev) => [deletedItem.data, ...prev]);
      } else if (deletedItem.type === "savedJobs") {
        setSavedJobs((prev) => [deletedItem.data, ...prev]);
      }
      setDeletedItem(null);
    }
  };

  const renderRightActions = (progress, dragX, applicationId, type) => {
    const trans = dragX.interpolate({
      inputRange: [-90, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={[styles.deleteButton, { transform: [{ translateX: trans }] }]}
          onPress={() => handleDelete(applicationId, type)}
        >
          <MaterialIcons name="delete" size={30} color="gray" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          progressViewOffset={100}
        />
      }
    >
      <Appbar.Header style={styles.headerContainer}>
        <View style={styles.userInfoContainer}>
          <Image
            source={
              user && user.media[0]
                ? { uri: user.media[0].original_url }
                : require("../../../assets/images/sample-profile.jpg")
            }
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.headerProfession}>
              Welcome Back{" "}
              <MaterialIcons name="emoji-emotions" color="yellow" />
            </Text>
            <Text style={styles.headerName}>
              {user?.firstname || "N/A"}
            </Text>
          </View>
        </View>
        <View style={styles.iconsContainer}>
          <HeaderMessageNotification />
          <HeaderNotification />
        </View>
      </Appbar.Header>

      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          style={styles.searchbar}
          onChangeText={setSearchQuery}
          value={searchQuery}
          inputStyle={styles.searchInput}
          placeholderTextColor="gray"
        />

        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Job Applications</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Application")}
            >
              <Text style={styles.seeMoreText}>({applications.length})</Text>
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {isFetched &&
              applications.length > 0 &&
              applications.slice(0, 3).map((application) => (
                <Swipeable
                  key={application.id}
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, application.id, "applications")
                  }
                >
                  <JobApplications application={application} />
                </Swipeable>
              ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Job Offers</Text>
            <TouchableOpacity
              onPress={() => handleSeeMore("offers")}
              style={styles.seeMoreContainer}
            >
              <Text style={styles.seeMoreText}>({offeredJobs.length})</Text>
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {isFetched &&
              offeredJobs.length > 0 &&
              offeredJobs.map((job) => (
                <Swipeable
                  key={job.id}
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, job.id, "offers")
                  }
                >
                  <ApplicationListCard application={job} />
                </Swipeable>
              ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Saved Jobs </Text>
            <TouchableOpacity
              onPress={() => handleSeeMore("savedJobs")}
              style={styles.seeMoreContainer}
            >
              <Text style={styles.seeMoreText}>({savedJobs.length})</Text>
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {isFetched &&
              savedJobs.length > 0 &&
              savedJobs.map((job) => (
                <Swipeable
                  key={job.id}
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, job.id, "savedJobs")
                  }
                >
                  <ApplicationListCard application={job} />
                </Swipeable>
              ))}
          </View>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Portal>
        <Dialog visible={confirmationVisible} onDismiss={() => setConfirmationVisible(false)}>
          <Dialog.Title>Delete Item</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this item?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmationVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* <Snackbar
        visible={!!deletedItem}
        onDismiss={() => setDeletedItem(null)}
        action={{
          label: "Undo",
          onPress: undoDelete,
        }}
      >
        Item deleted
      </Snackbar> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  headerContainer: {
    backgroundColor: "#0A3480",
  },
  userInfoContainer: {
    flexDirection: "row",
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginLeft: 5,
    marginRight: 10,
  },
  headerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerProfession: {
    color: "#E0E0E0",
    fontSize: 14,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  container: {
    padding: 8,
    marginTop: 8,
  },
  searchbar: {
    height: 40,
    backgroundColor: "#E5E5EA",
    marginBottom: 8,
    borderRadius: 100,
  },
  searchInput: {
    paddingVertical: 8,
    bottom: 8,
    fontSize: 14,
  },
  card: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    marginTop: 8,
    flex: 1,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
    height: 1,
    backgroundColor: "#ccc",
  },
  cardContent: {
    marginTop: 8,
  },
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A3480",
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 8,
    margin: 8,
  },
});

export default Dashboard;
