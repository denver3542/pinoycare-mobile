import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/core";
import NotificationItem from "../../components/notification/NotificationItem";
import useNotification from "./hook/useNotifications";

const NotificationsList = () => {
  const {
    data,
    isFetched: notifIsFetched,
    isRefetching,
    refetch,
  } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  // Memoize the filtered and sorted notifications to prevent unnecessary calculations
  const filteredNotifications = useMemo(() => {
    if (!notifIsFetched || !data) return [];

    // Sort by date
    const sortedNotifications = [...data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Filter job offer notifications
    const jobOfferNotif = sortedNotifications.filter(
      (notif) => notif.type === "job_offer"
    );

    // Filter and deduplicate message notifications
    const filteredMessageNotif = sortedNotifications
      .filter((notif) => notif.type === "message_update")
      .filter(
        (notif, index, self) =>
          index === self.findIndex((t) => t.user_id === notif.user_id)
      );

    return [...jobOfferNotif, ...filteredMessageNotif];
  }, [data, notifIsFetched]);

  useEffect(() => {
    setNotifications(filteredNotifications);
  }, [filteredNotifications]);

  const renderItem = ({ item }) => <NotificationItem item={item} />;

  console.log(notifications);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Notifications" color="white" />
      </Appbar.Header>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#0A3480",
  },
  listContainer: {
    padding: 10,
  },
});

export default NotificationsList;
