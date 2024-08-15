import moment from "moment";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, List, Text } from "react-native-paper";
import useNotification from "../../screens/Notifications/hook/useNotifications";
import { useQueryClient } from "@tanstack/react-query";

export default function NotificationItem({ item }) {
  const { markAsRead } = useNotification();
  const queryClient = useQueryClient();
  const onNotificationPress = (item) => {
    // console.log("Notification pressed:", notificationId);
    if (item.read === 0) {
      if (markAsRead(item.id)) {
        queryClient.invalidateQueries(["notifications"]);
      }
    }
    // Add your navigation or handling logic here
  };
  return (
    <TouchableOpacity onPress={() => onNotificationPress(item)}>
      <List.Item
        title={item.message}
        titleStyle={{
          fontSize: 15,
          fontWeight: item.read === 0 ? "800" : "300",
        }}
        description={(props) => (
          <React.Fragment>
            <Text
              variant="labelMedium"
              style={{
                fontWeight: item.read === 0 ? "800" : "300",
              }}
            >
              {item.type === "message_update" ? "Message update" : "Job update"}
            </Text>
            <Text variant="labelSmall">
              {moment(item.updated_at).format("MM/DD/YYYY hh:mm A")}
            </Text>
          </React.Fragment>
        )}
        left={(props) => <List.Icon {...props} icon="bell" />}
        descriptionStyle={{
          fontWeight: item.read === 0 ? "800" : "300",
        }}
      />
      <Divider />
    </TouchableOpacity>
  );
}
