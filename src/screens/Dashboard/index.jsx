import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import {
  Text,
  Searchbar,
  Divider,
  useTheme,
  Appbar,
  ActivityIndicator,
} from "react-native-paper";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "./hooks/useDashboard";
import ApplicationListCard from "../../components/ApplicationListCard";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderMessageNotification from "../../components/HeaderMessageNotification";
import HeaderNotification from "../../components/HeaderNotification";

function Dashboard() {
  const { colors } = useTheme();
  const { user } = useUser();
  const { data, isFetched, refetch } = useDashboard();
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

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (isFetched) {
      setApplications(data?.applications || []);
      setOfferedJobs(data?.job_offers || []);
      setSavedJobs(data?.saved_jobs || []);
    }
  }, [isFetched, data]);

  const handleSeeMore = async (type) => {
    if (type === "offers") {
      setLoadingJobOffers(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowMoreOffers(true);
      setLoadingJobOffers(false);
    } else if (type === "savedJobs") {
      setLoadingSavedJobs(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowMoreSavedJobs(true);
      setLoadingSavedJobs(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F4F7FB' }}
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
              Welcome Back <MaterialIcons name="emoji-emotions" color="yellow" />
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

        {/* Job Applications Section */}
        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Job Applications</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Application")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {isFetched && applications.length > 0 ? (
              <>
                {applications[0] && ( // Add null check here
                  <ApplicationListCard application={applications[0]} />
                )}
              </>
            ) : (
              <View style={styles.notAvailable}>
                <MaterialIcons name="description" size={50} color="gray" />
                <Text style={styles.notAvailableText}>Currently, No Application</Text>
              </View>
            )}
          </View>
        </View>

        {/* Job Offers Section */}
        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Job Offers</Text>
            <TouchableOpacity onPress={() => handleSeeMore("offers")} style={styles.seeMoreContainer}>
              <Text style={styles.seeMoreText}>{loadingJobOffers ? "Loading..." : "See More"}</Text>
              {loadingJobOffers && <ActivityIndicator animating={true} color={colors.primary} size={14} />}
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {isFetched && offeredJobs.length > 0 ?
              (
                <>
                  {offeredJobs.slice(0, showMoreOffers ? undefined : 1).map((job, index) => (
                    <View key={index}>
                      {job && ( // Add null check here
                        <ApplicationListCard application={job} />
                      )}
                      {index !== offeredJobs.length - 1 && <Divider style={styles.divider} />}
                    </View>
                  ))}
                  {showMoreOffers && loadingJobOffers && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator animating={true} color={colors.primary} size={"small"} />
                      <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.notAvailable}>
                  <MaterialIcons name="description" size={50} color="gray" />
                  <Text style={styles.notAvailableText}>Currently, No Job Offers</Text>
                </View>
              )}
          </View>
        </View>



        {/* Saved Jobs Section */}
        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Saved Jobs</Text>
            <TouchableOpacity onPress={() => handleSeeMore("savedJobs")} style={styles.seeMoreContainer}>
              <Text style={styles.seeMoreText}>{loadingSavedJobs ? "Loading..." : "See More"}</Text>
              {loadingSavedJobs && <ActivityIndicator animating={true} color={colors.primary} size={14} />}
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {isFetched && savedJobs.length > 0 ? (
              <>
                {showMoreSavedJobs ? (
                  savedJobs.map((job, index) => (
                    <View key={index}>
                      {job && ( // Add null check here
                        <ApplicationListCard application={job} />
                      )}
                      {index !== savedJobs.length - 1 && <Divider style={styles.divider} />}
                    </View>
                  ))
                ) : (
                  <View key={0}>
                    {savedJobs[0] && (
                      <ApplicationListCard application={savedJobs[0]} />
                    )}
                    {savedJobs.length > 1 && <Divider style={styles.divider} />}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.notAvailable}>
                <MaterialIcons name="description" size={50} color="gray" />
                <Text style={styles.notAvailableText}>Currently, No Saved Job</Text>
              </View>
            )}
          </View>
        </View>


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginTop: 8,
  },
  card: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    marginTop: 8,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#0A3480',
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
  searchbar: {
    height: 40,
    backgroundColor: '#E5E5EA',
    marginBottom: 8,
    borderRadius: 100,
  },
  searchInput: {
    paddingVertical: 8,
    bottom: 8,
    fontSize: 14,
  },
  cardContent: {
    marginTop: 8,
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
  notAvailable: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notAvailableText: {
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A3480',
  },
  seeMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A3480',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 5,
  },
});

export default Dashboard;
