import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableHighlight,
} from "react-native";
import { Appbar, Searchbar } from "react-native-paper";
import useSearchJobs from "../Jobs/hook/useSearchJobs";
import { ScrollView } from "react-native-gesture-handler";

const GeneralSearch = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { data, isLoading, error } = useSearchJobs(searchQuery);

  useEffect(() => {
    if (data) {
      const combinedResults = [
        ...(data.jobs || []).map((job) => ({
          ...job,
          type: "job",
          key: `job-${job.id}`,
        })),
        ...(data.posts || []).map((post) => ({
          ...post,
          type: "post",
          key: `post-${post.id}`,
        })),
      ];
      setSearchResults(combinedResults);
    }
  }, [data]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const noResults = searchQuery && searchResults.length === 0;

  const handlePress = (item) => {
    if (item.type === "job") {
      navigation.navigate("Job", { job: item });
    } else if (item.type === "post") {
      navigation.navigate("Feeds", { post: item });
    }
  };

  const renderItemView = (item) => {
    if (item.type === "job") {
      return (
        <View style={styles.cardContentRow}>
          {item.media && item.media.length > 0 && item.media[0].original_url ? (
            <Image
              source={{ uri: item.media[0].original_url }}
              style={styles.jobImage}
            />
          ) : (
            <></>
          )}
          <View style={styles.resultContent}>
            <Text style={styles.resultItem}>{item.title}</Text>
            <Text style={styles.resultCompany}>{item.company}</Text>
            <Text style={styles.resultLocation}>{item.location}</Text>
          </View>
        </View>
      );
    }

    if (item.type === "post") {
      return (
        <View style={styles.cardContentRow}>
           <Image source={require("../../../../assets/icon.png")} style={styles.postLogo} />
          <View style={styles.resultContent}>
            <Text style={styles.resultItem}>{item.title}</Text>
            <Text style={styles.resultPostContent}>{item.content}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
     <Appbar.Header style={styles.appBar}>
  <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
  <Searchbar
    placeholder="Search key word"
    onChangeText={handleSearch}
    value={searchQuery}
    inputStyle={styles.searchInput}
    placeholderTextColor="gray"
    style={styles.searchbar}
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
            <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
              {searchResults.map((item) => (
                <TouchableHighlight
                  key={item.key}
                  onPress={() => handlePress(item)}
                  underlayColor="#ddd"
                  style={styles.card}
                >
                  {renderItemView(item)}
                </TouchableHighlight>
              ))}
            </ScrollView>
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
    flex: 1,
    height: 36,
    backgroundColor: "#E5E5EA",
    borderRadius: 100,
    marginRight: 10,
  },
  iosSearchBar: {
    borderRadius: 100,
    height: 40,
    backgroundColor: "#E5E5EA",
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
    padding: 0,
    justifyContent: 'center'
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
    borderWidth: 0.5,
    borderColor: "#ddd",
    flexDirection: "row",
  },
  cardContentRow: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  resultItem: {
    fontSize: 16,
    fontWeight: "600",
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noResultText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  placeholderCard: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "gray",
    alignSelf: "flex-start",
  },
  resultContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  resultPostContent: {
    top: -15,
    textAlign: 'justify',
    fontSize: 12,
  },
  postLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
});

export default GeneralSearch;
