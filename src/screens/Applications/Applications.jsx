import React, { useState } from "react";
import { View, Image, StyleSheet, FlatList, RefreshControl, Animated, TouchableOpacity } from "react-native";
import { Appbar, Searchbar, useTheme, Dialog, Button, Paragraph } from "react-native-paper";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from 'react-native-gesture-handler';
import ApplicationsJobList from "./ApplicationsJobList";
import { useDashboard } from "../Dashboard/hooks/useDashboard";
import Spinner from "react-native-loading-spinner-overlay";

const Applications = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: dashboardData, isFetched, refetch, deleteApplication } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [applicationsIdToDelete, setApplicationsIdToDelete] = useState(null);

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .finally(() => setRefreshing(false));
  };

  const handleDelete = (applicationId) => {
    deleteApplication.mutate(applicationId, {
      onSuccess: () => {
        console.log("Application deleted successfully");
        setDialogVisible(false);
      },
      onError: (error) => {
        console.error('Error deleting application:', error);
        setDialogVisible(false);
      }
    });
  };

  const renderRightActions = (progress, dragX, itemId) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={[styles.deleteButton, { transform: [{ translateX: trans }] }]}
          onPress={() => {
            setApplicationsIdToDelete(itemId);
            setDialogVisible(true);
          }}
        >
          <MaterialIcons name="delete" size={30} color="gray" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderJob = ({ item }) => {
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
        <Swipeable
          renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
        >
          <View style={styles.itemContainer}>
            <ApplicationsJobList application={item} />
          </View>
        </Swipeable>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small" style={{ backgroundColor: '#0A3480' }}>
        <Image source={require("../../../assets/pinoycare.png")} style={styles.imageStyle} />
        <Appbar.Content title="Applications" titleStyle={{ color: 'white' }} />
      </Appbar.Header>
      {isFetched && dashboardData.applications && <Spinner />}
      <FlatList
        data={dashboardData.applications || []}
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
          <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
            <Searchbar
              placeholder="Search Application"
              style={styles.searchBar}
              onChangeText={setSearchQuery}
              value={searchQuery}
              inputStyle={{ paddingVertical: 8, bottom: 8, fontSize: 14 }}
              placeholderTextColor="gray"
            />
          </View>
        }
      // contentContainerStyle={styles.listContainer}
      />
      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Confirm Delete</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Are you sure you want to delete this?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
          <Button onPress={() => {
            handleDelete(applicationsIdToDelete);
          }}>Delete</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  listContainer: {
    padding: 8,
  },
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
    // marginBottom: 15
  },
  itemContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 15,
    elevation: 0,

  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 8,
    margin: 8,
  },
});

export default Applications;
