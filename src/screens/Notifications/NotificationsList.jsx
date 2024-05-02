import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { List, Button, Divider, Appbar, Text } from "react-native-paper";
import { useUser } from "../../hooks/useUser";
import moment from "moment";
import { useNavigation } from "@react-navigation/core";

const notifications = [
  {
    id: 1,
    title: "New Message",
    description: "You have received a new message.",
  },
  {
    id: 2,
    title: "Update Available",
    description: "A new update is available for download.",
  },
  // Add more notifications here
];

const NotificationItem = ({ title, description, onPress, date }) => (
  <View>
    <List.Item
      title={title}
      titleStyle={{ fontSize: 15 }}
      description={() => (
        <View>
          <Text variant="labelMedium" style={{ fontWeight: "500" }}>
            {description}
          </Text>
          <Text variant="labelSmall">
            {moment(date).format("MM/DD/YYYY hh:mm A")}
          </Text>
        </View>
      )}
      left={(props) => <List.Icon {...props} icon="bell" />}
    //   right={() => onPress && <Button onPress={onPress}>View</Button>}
    />
    <Divider />
  </View>
);

const NotificationsList = () => {
  const { user, isFetched } = useUser();
  const navigation = useNavigation();
  const onNotificationPress = (notificationId) => {
    console.log("Notification pressed, id:", notificationId);
    // Add your navigation or handling logic here
  };
  const renderItem = ({ item }) => (
    <NotificationItem
      title={item.message}
      description={
        item.type === "message_update" ? "Message update" : "Job update"
      }
      onPress={() => onNotificationPress(item.id)}
      date={item.updated_at}
    />
  );

  return (
    <View>
      <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Notifications" color="white" />
      </Appbar.Header>
      <FlatList
        data={user.notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default NotificationsList;
