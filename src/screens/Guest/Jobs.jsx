import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Appbar, Searchbar, useTheme } from "react-native-paper";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import useJobs from "./hooks/useJobs";
import Job from "./Job";

const GuestJobs = () => {
  const { colors } = useTheme();
  const { data, isLoading, isFetching, isRefetching, refetch } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => { })
      .catch(() => { })
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

  console.log(filteredJobs);

  const renderJob = ({ item }) => {
    const postedDate = moment(item.date_posted).format("LL");
    const navigateToJobDetails = () =>
      navigation.navigate("Job", { job: item });

    return (
      <TouchableOpacity onPress={navigateToJobDetails}>
        <Job job={item} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Spinner isLoading={isLoading} />}

      <Searchbar
        placeholder="Search jobs"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      />
      {/* {data &&
          data.map((job, i) => {
            return (
              <View key={i}>
                
              </View>
            );
          })} */}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    margin: 10,
    borderRadius: 8,
  },
  listContainer: {
    padding: 10,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    height: "auto",
    marginVertical: 10,
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  activeCard: {
    // Active styles
    scale: 1,
    opacity: 1,
  },
  textContainer: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  company: {
    flexDirection: "row",
    margin: "0 auto",
    gap: 20,
  },
  JobContent: {
    flexDirection: "column",
    marginTop: 20,
  },
});

export default GuestJobs;
