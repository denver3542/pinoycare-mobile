import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Image,
  TouchableHighlight
} from "react-native";
import { Appbar, Searchbar } from "react-native-paper";
import useSearchJobs from "../Jobs/hook/useSearchJobs";

const SearchJob = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");

  const { data, isLoading, error } = useSearchJobs(searchQuery);

  useEffect(() => {
    if (data && data.jobs) {
      setSearchResults(data.jobs);
    }
  }, [data]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const noResults = searchQuery && data?.jobs?.length === 0;

  const handleJobPress = (job) => {
    navigation.navigate('Job', { job });
  };


  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content
          title={
            <Searchbar
              placeholder="Search"
              onChangeText={handleSearch}
              value={searchQuery}
              inputStyle={styles.searchInput}
              placeholderTextColor="gray"
               style={Platform.OS === 'ios' ? styles.iosSearchBar : styles.searchbar}
            />
          }
        />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        {error && <Text>Error: {error.message}</Text>}
        {searchQuery ? (
          noResults ? (
            <View style={styles.noResult}>
              <MaterialIcons name="search-off" size={100} color="gray" />
              <Text style={styles.noResultText}>No results found</Text>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.textResult}>
                {data?.jobs?.length || 0} result
                {data?.jobs?.length !== 1 ? "s" : ""} found
              </Text>
              {data?.jobs?.map((job) => (
                <TouchableHighlight key={job.id} onPress={() => handleJobPress(job)}
                     underlayColor="#ddd" style={styles.card}>
                  <View style={styles.cardContentRow}>
                    {job.media &&
                    job.media.length > 0 &&
                    job.media[0].original_url ? (
                      <Image
                        source={{ uri: job.media[0].original_url }}
                        style={styles.jobImage}
                      />
                    ) : (
                      <View style={styles.placeholderCard} />
                    )}
                    <View style={styles.resultConent}>
                      <Text style={styles.resultItem}>{job.title}</Text>
                      <Text style={styles.resultCompany}>{job.company}</Text>
                      <Text style={styles.resultLocation}>{job.location}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              ))}
            </View>
          )
        ) : (
          <View style={styles.noResult}>
            <MaterialIcons name="search" size={100} color="gray" />
            <Text style={styles.noResultText}>Search Here</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  appBar: {
    backgroundColor: "#0A3480",
    height: 60,
    justifyContent: "center",
  },
  searchbar: {
    height: Platform.OS === "ios" ? 32 : 36,
    backgroundColor: "#E5E5EA",
    borderRadius: 100,
    marginRight: 10,
  },
  iosSearchBar: {
    flex: 1,
    borderRadius: 100,
    height: 40,
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 0,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  searchInput: {
    paddingVertical: 8,
    bottom: 10,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
  resultContainer: {
    margin: 8,
  },
  textResult: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#ddd",
    flexDirection: 'row',
  },
  cardContentRow: {
    alignItems: 'center', 
    flexDirection: 'row',
 },
  resultItem: {
    fontSize: 16,
    fontWeight: '600'
  },
  resultCompany: {
    fontSize: 13,
    color: "#666",
  },
  resultLocation: {
    fontSize: 12,
    color: "#666",
  },
  noResult: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noResultText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  placeholderCard: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "gray",
    alignSelf: "flex-start",
  },
  resultConent: {
    marginLeft: 15
  },
});

export default SearchJob;
