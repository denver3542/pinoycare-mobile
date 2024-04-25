import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import AuthenticatedLayout from "../../Layout/User/Unauthorize/AuthenticatedLayout";
import Carousel from "react-native-snap-carousel";
import CustomJobCard, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from "../../components/CustomJobCard";
import RecentJobCard from "../../components/CustomRecentJobCard";
import { useUser } from "../../hooks/useUser";
import { useJobs } from "../../hooks/jobService";
import { Searchbar } from "react-native-paper";
import HeaderNotification from "../../components/HeaderNotification";
import HeaderMessageNotification from "../../components/HeaderMessageNotification";

function Dashboard(activeNav) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user, isFetching, loading } = useUser();
  const { jobs, isLoading, error } = useJobs();

  const renderItem = ({ item, index }) => {
    return (
      <CustomJobCard key={index} job={item} isActive={index === activeIndex} />
    );
  };
  const profileImagePath =
    user && user.profile_picture
      ? { uri: user.profile_picture }
      : require("../../../assets/images/sample-profile.jpg");
  const activeBottomNav = activeNav?.route?.name;
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <AuthenticatedLayout activeBottomNav={activeBottomNav}>
      <ScrollView>
        {!loading && (
          <>
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                <View style={styles.userInfoContainer}>
                  <Image
                    source={profileImagePath}
                    style={styles.profileImage}
                  />
                  <View style={styles.userInfoText}>
                    <Text style={styles.headerName}>{user?.name || "N/A"}</Text>
                    <Text style={styles.headerProfession}>
                      {user?.profession || "N/A"}
                    </Text>
                  </View>
                </View>
                <View style={styles.iconsContainer}>
                  <HeaderMessageNotification />
                  <HeaderNotification />
                </View>
              </View>
              <Searchbar
                placeholder="secret"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
              />
            </View>

            <View style={styles.contentStyle}>
              <View style={styles.headerJobs}>
                <Text
                  style={{ fontWeight: "bold", marginBottom: 15, fontSize: 20 }}
                >
                  Recommendation
                </Text>
                <TouchableOpacity>
                  <Text style={{ marginBottom: 15, color: "gray" }}>
                    Show All
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.carouselContainer}>
                {jobs.length > 0 ? (
                  <Carousel
                    layout="default"
                    data={jobs}
                    loop={true}
                    renderItem={renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    firstItem={0}
                  />
                ) : (
                  <View style={styles.noJobsContainer}>
                    <Text style={styles.noJobsText}>No Jobs Available</Text>
                  </View>
                )}
              </View>
              <View style={styles.headerJobs}>
                <Text
                  style={{ fontWeight: "bold", marginBottom: 15, fontSize: 20 }}
                >
                  Recent Job List
                </Text>
                <TouchableOpacity>
                  <Text style={{ marginBottom: 15, color: "gray" }}>
                    Show All
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryJobsView}>
                {jobs && jobs.length > 0 ? (
                  jobs
                    .slice(0, 5)
                    .map((job, index) => (
                      <RecentJobCard
                        key={index}
                        imageUrl={job.imageUrl}
                        jobTitle={job.title}
                        type={job.type}
                        location={job.location}
                      />
                    ))
                ) : (
                  <View style={styles.noJobsContainer}>
                    <Text style={styles.noJobsText}>No Jobs Available</Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#0A3480",
    height: 200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfoContainer: {
    flexDirection: "row", // Align elements horizontally
    alignItems: "center", // Center vertically
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  userInfoText: {
    flexDirection: "column", // Stack the text elements vertically
  },
  headerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerProfession: {
    color: "gray",
    fontSize: 14,
  },
  iconsContainer: {
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  searchbar: {
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    bottom: 30,
    backgroundColor: "white",
    elevation: 1,
    borderRadius: 15,
  },
  subHeaderText: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
  },
  // overlay: {
  //     position: 'absolute',
  //     width: '100%',
  //     height: '100%',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backgroundColor: 'rgba(0, 18, 52, 0.7)',
  // },
  contentStyle: {
    flex: 1,
    padding: 10,
  },
  headerJobs: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carouselContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noJobsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  noJobsText: {
    fontSize: 18,
    color: "gray",
  },
  categoryJobsView: {
    marginTop: 15,
  },
  categoryBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});

export default Dashboard;
