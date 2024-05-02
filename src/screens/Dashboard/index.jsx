import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import {
  Text,
  Searchbar,
  Divider,
  Button,
  useTheme,
  ActivityIndicator,
  Appbar,
  Avatar,
} from "react-native-paper";
import AuthenticatedLayout from "../../Layout/User/Unauthorize/AuthenticatedLayout";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "./hooks/useDashboard";
import ApplicationListCard from "../../components/ApplicationListCard";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import HeaderNotification from "../../components/HeaderNotification";
import HeaderMessageNotification from "../../components/HeaderMessageNotification";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
function Dashboard({ activeNav }) {
  const { colors } = useTheme();
  const { user, isFetching, isLoading } = useUser();
  const { data, isFetched, isFetching: dashboardIsFetching, refetch } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const [applications, setApplications] = useState([]);
  const [offeredJobs, setOfferedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        setRefreshing(false);
      });
  };


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
    <ScrollView style={{ flex: 1, backgroundColor: '#F4F7FB' }} refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[colors.primary]}
        progressViewOffset={100}
      />
    }>


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
              Welcome Back <MaterialIcons name="emoji-emotions" color="yellow"></MaterialIcons>
            </Text>
            <Text style={styles.headerName}>
              {user?.name || "N/A"}
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
          style={{ height: 40, backgroundColor: '#E5E5EA', marginBottom: 8 }}
          onChangeText={setSearchQuery}
          value={searchQuery}
          inputStyle={{ paddingVertical: 8, bottom: 8, fontSize: 14 }}
          placeholderTextColor="gray"
        />
        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Job Applications</Text>
            {isFetched && applications.length > 0 && (
              <TouchableOpacity onPress={handleSeeMore}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0A3480' }}>
                  See All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {isFetched && applications.length > 0 ? (
              <ApplicationListCard application={applications[0]} />
            ) : (
              <View style={[styles.notAvailable, { flexDirection: 'row' }]}>
                <MaterialIcons name="description" size={50} color="gray"></MaterialIcons>
                <Text style={{ fontWeight: 'bold', color: 'gray' }}>Currently,{'\n'}No Application</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Job Offers</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {/* {dashboardIsFetching && (
              <ActivityIndicator animating={true} color={colors.primary} />
            )} */}
            {isFetched && offeredJobs?.length > 0 ? (
              offeredJobs?.map((app, key) => (
                <ApplicationListCard key={key} application={app} />
              ))
            ) : (
              <View style={[styles.notAvailable, { flexDirection: 'row' }]}>
                <MaterialIcons name="description" size={50} color="gray"></MaterialIcons>
                <Text style={{ fontWeight: 'bold', color: 'gray' }}>Currently, {'\n'}No Job Offers</Text>
              </View>

            )}
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Saved Jobs</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.cardContent}>
            {/* {dashboardIsFetching && (
              <ActivityIndicator animating={true} color={colors.primary} />
            )} */}
            {isFetched && savedJobs && savedJobs.length > 0 ? (
              savedJobs.map((job, index) => (
                <ApplicationListCard key={index} application={job} />
              ))
            ) : (
              <View style={[styles.notAvailable, { flexDirection: 'row' }]}>
                <MaterialIcons name="description" size={50} color="gray"></MaterialIcons>
                <Text style={{ fontWeight: 'bold', color: 'gray' }}>Currently,{'\n'}No Saved Job</Text>
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
    marginTop: 8
  },
  card: {
    padding: 15,
    borderRadius: 15,
    elevation: 0,
    backgroundColor: "white",
    marginTop: 8,
    flex: 1
  },
  headerContainer: {
    backgroundColor: '#0A3480',
    // justifyContent: 'space-between'
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
    color: "#E0E0E0",
    fontSize: 14
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
    marginBottom: 8
    // bottom: 5
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
    // marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  showAllText: {
    color: "#0A3480",
    fontSize: 16,
  },
  divider: {
    marginVertical: 10,
    height: 1,
    backgroundColor: "#ccc",
  },
  applicationList: {
    marginTop: 10,
  },
  noJobsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },

  notAvailable: {
    padding: 8,
    borderRadius: 8,
    // elevation: 1,
    // backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Dashboard;