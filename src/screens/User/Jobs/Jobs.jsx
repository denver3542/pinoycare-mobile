import React, { useState, useLayoutEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Text, Image, TextInput, Platform } from 'react-native';
import useJobs from './hook/useJobs';
import Spinner from 'react-native-loading-spinner-overlay';
import { Appbar, Card, Paragraph, IconButton, useTheme, TouchableRipple, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import { FontAwesome5 } from "@expo/vector-icons";
import { color } from '@rneui/base';
import HeaderMessageNotification from '../../../components/HeaderMessageNotification';
import HeaderNotification from '../../../components/HeaderNotification';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const JobListings = ({ activeNav }) => {
  const { colors } = useTheme();
  const { data, isLoading, isRefetching, refetch } = useJobs();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState({});
  const handleSave = (jobId) => {
    setSavedJobs((prevSavedJobs) => ({
      ...prevSavedJobs,
      [jobId]: !prevSavedJobs[jobId],
    }));
    console.log("save job");
  };
  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        setRefreshing(false);
      });
  };
  const [descriptionVisibility, setDescriptionVisibility] = useState({});

  const toggleDescriptionVisibility = (jobId) => {
    setDescriptionVisibility((prevVisibility) => ({
      ...prevVisibility,
      [jobId]: !prevVisibility[jobId],
    }));
  };

  const truncateDescription = (description, jobId, limit = 150) => {
    if (description.length <= limit || descriptionVisibility[jobId]) {
      return description;
    }
    return description.slice(0, limit) + '...';
  };

  const onChangeSearch = (query) => setSearchQuery(query);

  const filteredJobs = data?.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const navigateToJobDetails = (job) => {
    navigation.navigate('Job', { job });
  };

  const renderJob = ({ item }) => {
    const descriptionLimit = 150;

    const isTruncated = item.description.length > descriptionLimit;

    return (
      <TouchableRipple onPress={() => navigateToJobDetails(item)} style={styles.card}>
        <View style={styles.cardContentRow}>
          {
            item.media && item.media.length > 0 && item.media[0].original_url ? (
              <Image source={{ uri: item.media[0].original_url }} style={styles.jobImage} />
            ) : (
              <View style={styles.placeholderCard} />
            )
          }

          <View style={styles.cardContentText}>
            <View style={styles.titleRow}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.company}>{item.company}</Text>
              </View>
              <IconButton
                icon={savedJobs[item.id] ? "heart" : "heart-outline"}
                onPress={() => handleSave(item.id)}
                selected
              />
            </View>
            {/* <Paragraph style={styles.company}>{item.company}</Paragraph> */}
            <Text style={styles.postedDate}>Posted {moment(item.created_at).fromNow()}</Text>
            <Paragraph style={styles.location}>
              <MaterialIcons name="location-on" size={14} color="#0A3480" />
              {` ${item.location}`}
            </Paragraph>
            <HTMLView
              value={truncateDescription(item.description, item.id, descriptionLimit)}
              style={styles.description}
            />
            {isTruncated && (
              <Text style={styles.readMore} onPress={() => toggleDescriptionVisibility(item.id)}>
                {descriptionVisibility[item.id] ? 'Read less' : 'Read more'}
              </Text>
            )}
          </View>
        </View>
      </TouchableRipple>
    );
  };



  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
        <Image source={require("../../../../assets/pinoycare.png")} style={styles.imageStyle} />
        <Appbar.Content title="Jobs" titleStyle={{ color: 'white' }} />
        <HeaderMessageNotification />
        <HeaderNotification />
      </Appbar.Header>

      {isLoading ? (
        <Spinner visible={isLoading} />
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <Searchbar
              placeholder="Search job"
              onChangeText={onChangeSearch}
              value={searchQuery}
              inputStyle={{ paddingVertical: 8, bottom: 8, fontSize: 14 }}
              placeholderTextColor="gray"
              style={Platform.OS === 'ios' ? styles.iosSearchBar : styles.searchBar}
            />
          }
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>

  );
};
// style={{ backgroundColor: colors.primary }}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
  card: {
    // flex: 1,
    marginTop: 8,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 0,
  },
  cardContentRow: {
    flexDirection: 'row',
    paddingHorizontal: 8
  },
  cardContentText: {
    flex: 1,
    paddingLeft: 10,
  },

  listContentContainer: {
    padding: 8
    // backgroundColor: 'white'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,

  },
  postedDate: {
    marginBottom: 4,
    color: '#888',
    fontSize: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
  },
  description: {
    marginTop: 5,
  },
  company: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray'
  },
  readMore: {
    color: '#0A3480',
    marginTop: 5,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 5
  },
  placeholderCard: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'gray',
  },
  searchBar: {
    flex: 1,
    borderRadius: 100,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
    // marginHorizontal: 10,
    // bottom: 5

  },
  iosSearchBar: {
    flex: 1,
    borderRadius: 8,
    height: 40,
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 0,
    marginVertical: 8,
    marginHorizontal: 8,
    // bottom: 5
  },

  titleStyle: {
    fontWeight: 'bold'
  },
  imageStyle: {
    width: 30, // Adjust width as needed
    height: 30, // Adjust height as needed
    marginLeft: 10, // Adjust margin as needed
    marginRight: 10
  },
});

export default JobListings;
