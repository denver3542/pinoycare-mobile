import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, View, RefreshControl } from "react-native";
import { Appbar, Searchbar, useTheme } from "react-native-paper";
import ApplicationsJobList from "./ApplicationsJobList";
import useApplications from "./hook/useApplications";
import Spinner from "react-native-loading-spinner-overlay";

const Applications = () => {
  const { colors } = useTheme();
  const { data: allApplications, isFetching, refetch } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const renderJob = ({ item, index }) => {
    if (!item || !item.job) {
      return null;
    }

    const { title, company, type } = item.job;
    const lowerCaseQuery = searchQuery.toLowerCase();

    if (
      title.toLowerCase().includes(lowerCaseQuery) ||
      company.toLowerCase().includes(lowerCaseQuery) ||
      type.toLowerCase().includes(lowerCaseQuery)
    ) {
      return (
        <View style={styles.itemContainer}>
          <ApplicationsJobList application={item} />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {isFetching && <Spinner />}
      <Appbar.Header mode="small" style={{ backgroundColor: '#0A3480' }}>
        <Image source={require("../../../assets/pinoycare.png")} style={styles.imageStyle} />
        <Appbar.Content title="Applications" titleStyle={{ color: 'white' }} />
      </Appbar.Header>
      <FlatList
        data={allApplications}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <Searchbar
            placeholder="Search Application"
            style={styles.searchBar}
            onChangeText={setSearchQuery}
            value={searchQuery}
            inputStyle={{ paddingVertical: 8, bottom: 8, fontSize: 14 }}
            placeholderTextColor="gray"
          />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB', },
  listContainer: { padding: 8, },
  imageStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10
  },
  searchBar: {
    flex: 1,
    borderRadius: 100,
    height: 40,
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 0,
    marginVertical: 8,
    marginBottom: 15
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8

  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default Applications;
