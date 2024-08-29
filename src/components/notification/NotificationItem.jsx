import moment from "moment";
import React from "react";
import { Alert, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, List, Text } from "react-native-paper";
import useNotification from "../../screens/Notifications/hook/useNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

export default function NotificationItem({ item }) {
  const navigation = useNavigation();
  const { markAsRead } = useNotification();
  const queryClient = useQueryClient();
  const onNotificationPress = (item) => {
    if (item.read === 0) {
      if (markAsRead(item.id)) {
        queryClient.invalidateQueries(["notifications"]);
      }
    }
    // Add your navigation or handling logic here
    // if type is equal to job_offer, then it must navigate to Job Details
    if (item.type === "job_offer") {
      if (item.job_offer) {
        navigation.navigate("Job", item.job_offer);
      } else {
        Alert.alert("Job not found.");
      }
    } else if (item.type === "message_update") {
      if (item.message_rel) {
        navigation.navigate("ChatConversation", {
          contact: item.message_rel?.sender,
        });
      } else {
        Alert.alert("Message not found.");
      }
    }
  };

  return (
    <TouchableOpacity onPress={() => onNotificationPress(item)}>
      <List.Item
        title={item.message}
        titleStyle={{
          fontSize: 15,
          fontWeight: item.read === 0 ? "800" : "500",
        }}
        description={(props) => (
          <React.Fragment>
            <Text
              variant="labelMedium"
              style={{
                fontWeight: item.read === 0 ? "800" : "500",
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
