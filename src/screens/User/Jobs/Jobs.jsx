import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Text, Image, TextInput, Platform, useWindowDimensions, TouchableHighlight } from 'react-native';
import { Appbar, IconButton, useTheme, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useUser } from '../../../hooks/useUser';
import useJobs, { useSaveJob } from './hook/useJobs';
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderMessageNotification from '../../../components/HeaderMessageNotification';
import HeaderNotification from '../../../components/HeaderNotification';

const Matching = ({ rating }) => {
    const { colors } = useTheme();

    // Calculate the percentage
    const getPercentage = (rating) => {
      if (typeof rating !== 'number' || isNaN(rating) || rating < 0 || rating > 4) {
        return 0;
      }
      return rating * 25;
    };

    const percentage = getPercentage(rating);

    return (
      <View style={styles.matchingContainer}>
        <Text style={styles.percentage}>
          {percentage}%
        </Text>
        <Text style={[styles.matchedText, { color: colors.primary }]}>Matched</Text>
      </View>
    );
  };

const JobListings = ({ activeNav, rating }) => {
  const { colors } = useTheme();
  const { data, isLoading, refetch } = useJobs();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const windowWidth = useWindowDimensions().width;
  const saveJob = useSaveJob();

  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
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

  const handleSave = (jobId) => {
    saveJob.mutate(jobId, {
      onError: (error) => {
        console.error('Failed to save job:', error);
      },
    });
  };

  const renderJob = ({ item }) => {
    const isSaved = user?.saved_jobs?.some(savedJob => savedJob.job_id === item.id);

    return (
      <TouchableHighlight
        onPress={() => navigateToJobDetails(item)}
        style={styles.card}
        underlayColor="#ddd"
      >
        <View style={styles.cardContentRow}>
          {item.media?.length > 0 && item.media[0].original_url ? (
            <Image source={{ uri: item.media[0].original_url }} style={styles.jobImage} />
          ) : (
            <View style={styles.placeholderCard} />
          )}
          <View style={styles.cardContentText}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <IconButton
                onPress={() => handleSave(item.id)}
                icon={isSaved ? "bookmark" : "bookmark-outline"}
                color={isSaved ? "#0A3480" : "#888"}
                size={24}
                style={styles.bookmarkIcon}
              />
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Matching rating={item.matchScore / 25} />
              <Text style={styles.postedDate}>Posted {moment(item.created_at).fromNow()}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Image source={require("../../../../assets/pinoycare.png")} style={styles.imageStyle} />
        <Appbar.Content title="Jobs" titleStyle={styles.appbarTitle} />
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
              inputStyle={styles.searchbarInput}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  appbar: {
    backgroundColor: '#0A3480',
  },
  appbarTitle: {
    color: 'white',
  },
  imageStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    marginTop: 8,
    backgroundColor: '#fff',
    padding: 0,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  cardContentRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cardContentText: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDetails: {
    marginBottom: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    flexShrink: 1,
  },
  company: {
    fontSize: 14,
    fontWeight: '500',
  },
  location: {
    fontWeight: '500',
  },
  postedDate: {
    color: '#888',
    fontSize: 12,
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 5,
  },
  placeholderCard: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'gray',
  },
  searchBar: {
    borderRadius: 100,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
  },
  iosSearchBar: {
    borderRadius: 8,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  searchbarInput: {
    paddingVertical: 8,
    fontSize: 14,
  },
  listContentContainer: {
    padding: 8,
  },
  bookmarkIcon: {
    left: 10,
  },
  matchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchedText: {
    fontWeight: '600',
    fontSize: 14,
  },
  percentage: {
    fontWeight: '600',
    marginRight: 5,
    fontSize: 14,
  },
});

export default JobListings;
