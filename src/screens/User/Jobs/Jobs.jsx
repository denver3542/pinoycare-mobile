import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Text, Image, TextInput, Platform, useWindowDimensions, Pressable, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Appbar, IconButton, useTheme, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useUser } from '../../../hooks/useUser';
import useJobs from './hook/useJobs';
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderMessageNotification from '../../../components/HeaderMessageNotification';
import HeaderNotification from '../../../components/HeaderNotification';
import { useSaveJob } from './hook/useJobs';

const Matching = ({ rating }) => {
    const { colors } = useTheme();

    const getPercentage = (rating) => {
      if (typeof rating !== 'number' || isNaN(rating) || rating < 0 || rating > 4) {
        return 0;
      }
      return rating * 25;
    };
    const percentage = getPercentage(rating);
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.percentage}>
          {percentage}%
        </Text>
        <Text style={[styles.matchedText, { color: colors.primary }]}>Matched</Text>
      </View>
    );
  };

const JobListings = ({ activeNav, rating }) => {
  const percentage = rating * 25;
  const { colors } = useTheme();
  const { data, isLoading, isRefetching, refetch } = useJobs();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState({});
  const windowWidth = useWindowDimensions().width;
  const saveJob = useSaveJob();

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
  ) || [];

  const navigateToJobDetails = (job) => {
    navigation.navigate('Job', { job });
  };

  const handleSave = async (jobId) => {
    try {
      saveJob.mutate(jobId);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const renderJob = ({ item }) => {
    const isSaved = user && user.saved_jobs && user.saved_jobs.find(savedJob => savedJob.job_id === item.id);

    return (
      <TouchableHighlight onPress={() => navigateToJobDetails(item)} style={styles.card}
        underlayColor="#ddd">
        <View style={styles.cardContentRow}>
          {
            item.media && item.media.length > 0 && item.media[0].original_url ? (
              <Image source={{ uri: item.media[0].original_url }} style={styles.jobImage} />
            ) : (
              <View style={styles.placeholderCard} />
            )
          }
          <View style={styles.cardContentText}>
         
              <Text style={styles.title} numberOfLines={2} ellipsizeMode='tail'>{item.title}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={{ fontWeight: '500' }}>{item.location}</Text>
              <Matching rating={item.matchScore / 25} />
              <Text style={styles.postedDate}>Posted {moment(item.created_at).fromNow()}</Text>
          </View>
          <IconButton
              onPress={() => handleSave(item.id)}
              icon={isSaved ? "bookmark" : "bookmark-outline"}
              color={isSaved ? "#0A3480" : "#888"}
              selected
              size={24}
              style={styles.iconButton}
            />
        </View>
      </TouchableHighlight>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  card: {
    marginTop: 8,
    padding: 0,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    position: 'relative',
    backgroundColor: '#fff'
  },
  cardContentRow: {
    alignItems: 'center', 
    flexDirection: 'row',
    padding: 10,
  },
  cardContentText: {
    flex: 1,
    marginLeft: 10,
  },
  listContentContainer: {
    padding: 8,
  },
  titleIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  iconButton: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    right: 0,
    alignSelf: 'flex-start'
  },
  company: {
    fontSize: 14,
    fontWeight: '',
  },
  postedDate: {
    color: '#888',
    fontSize: 12,
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  placeholderCard: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'gray',
     alignSelf: 'flex-start'
  },
  searchBar: {
    flex: 1,
    borderRadius: 100,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
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
  imageStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  matchedText: {
    color: '#0A3480',
    fontWeight: '600',
    fontSize: 13,
  },
  percentage: {
    color: '#0A3480',
    fontWeight: '600',
    marginRight: 5,
    fontSize: 13,
  },
});


export default JobListings;
