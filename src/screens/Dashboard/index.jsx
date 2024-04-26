import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import {
  Text,
  Searchbar,
  Divider,
  Button,
  useTheme,
  ActivityIndicator,
  Appbar,
} from "react-native-paper";
import AuthenticatedLayout from "../../Layout/User/Unauthorize/AuthenticatedLayout";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "./hooks/useDashboard";
import ApplicationListCard from "../../components/ApplicationListCard";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import HeaderNotification from "../../components/HeaderNotification";
import HeaderMessageNotification from "../../components/HeaderMessageNotification";

function Dashboard({ activeNav }) {
  const { colors } = useTheme();
  const { user, isFetching, isLoading } = useUser();
  const { data, isFetched, isFetching: dashboardIsFetching } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [applications, setApplications] = useState([]);
  const [offeredJobs, setOfferedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    if (isFetched) {
      setApplications(data?.applications || []);
    }
  }, [isFetched, data]);


  useEffect(() => {
    setOfferedJobs(data?.job_offers);
  }, [isFetched, data?.job_offers]);


  useEffect(() => {
    setSavedJobs(data?.saved_jobs);
  }, [isFetched, data?.saved_jobs]);

  const handleSeeMore = () => {
    navigation.navigate("Application");
  };

  return (
    <AuthenticatedLayout activeBottomNav={activeNav?.route?.name}>
      {isFetching ? (
        <Spinner visible={isLoading} />
      ) : (
        <View style={{ flex: 1 }}>
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
                <Text style={styles.headerName}>
                  {user?.name || "N/A"}
                </Text>
                <Text style={styles.headerProfession}>
                  {user?.profession || "N/A"}
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
              placeholder="Search applications / saved jobs / offers"
              style={{ height: 40, backgroundColor: '#E5E5EA' }}
              onChangeText={setSearchQuery}
              value={searchQuery}
              inputStyle={{ paddingVertical: 8, bottom: 8, fontSize: 14 }}
              placeholderTextColor="gray"
            />
            <Text style={styles.sectionTitle}>Job Applications</Text>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                {isFetched && applications.length > 0 ? (
                  applications.map((app, index) => (
                    <ApplicationListCard key={index} application={app} />
                  ))
                ) : (
                  <Text style={styles.noJobsText}>No Applications Available</Text>
                )}
                {isFetched && applications.length > 0 && (
                  <Button icon="redo" mode="contained" onPress={handleSeeMore}>
                    See more
                  </Button>
                )}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Job Offers</Text>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                {dashboardIsFetching && (
                  <ActivityIndicator animating={true} color={colors.primary} />
                )}
                {isFetched && offeredJobs?.length > 0 ? (
                  offeredJobs?.map((app, key) => (
                    <ApplicationListCard key={key} application={app} />
                  ))
                ) : (
                  <Text style={styles.noJobsText}>No Job Offers Available</Text>
                )}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Saved Jobs</Text>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                {dashboardIsFetching && (
                  <ActivityIndicator animating={true} color={colors.primary} />
                )}
                {isFetched && savedJobs && savedJobs.length > 0 ? (
                  savedJobs.map((job, index) => (
                    <ApplicationListCard key={index} application={job} />
                  ))
                ) : (
                  <Text style={styles.noJobsText}>No Saved Jobs Available</Text>
                )}
              </View>
            </View>

          </View>
        </View>
      )}
    </AuthenticatedLayout>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F7FB',
    padding: 8,
    marginTop: 8
  },
  card: {
    // padding: 8,
    // borderRadius: 8,
    // elevation: 1,
    // backgroundColor: "white",
    marginTop: 15,
    flex: 1
  },
  headerContainer: {
    backgroundColor: '#0A3480',
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfoContainer: {
    flexDirection: "row",
    flex: 1
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginLeft: 5,
    marginRight: 10
  },
  headerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerProfession: {
    color: "white",
    fontSize: 12
  },
  iconsContainer: {
    flexDirection: "row",
  },
  searchbar: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#E4EAF6',
    paddingHorizontal: 0,
    marginVertical: 10,
    marginHorizontal: 8,
    // bottom: 5
  },
  cardContent: {
    marginTop: 8,

  },

  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  showAllText: {
    color: "#0A3480",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  applicationList: {
    marginTop: 10,
  },
  noJobsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default Dashboard;