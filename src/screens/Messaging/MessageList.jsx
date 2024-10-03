import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { List, Appbar } from "react-native-paper";
import useMessaging from "./hook/useMessaging";
import Spinner from "react-native-loading-spinner-overlay";
import CustomAvatar from "../../components/CustomAvatar";

const MessageList = () => {
  const navigation = useNavigation();
  const { data, isFetching, isFetched, isRefetching, refetch, isLoading } =
    useMessaging();

  const renderItem = ({ item }) => {
    const user = item.user || {};
    const currentUserId = user.id || {}; 
    const receivedMessages = Array.isArray(user.received_messages)
      ? user.received_messages
      : [];
    const sentMessages = Array.isArray(user.sent_messages)
      ? user.sent_messages
      : [];
  
    const mostRecentReceived = receivedMessages.length
      ? receivedMessages[receivedMessages.length - 1]
      : null;

    const mostRecentSent = sentMessages.length
      ? sentMessages[sentMessages.length - 1]
      : null;

    let recentMessage = null;
    let isRead = true;
    let senderFirstName = '';
    
    if (mostRecentReceived && mostRecentSent) {
      recentMessage =
        new Date(mostRecentReceived.created_at) >
        new Date(mostRecentSent.created_at)
          ? mostRecentReceived
          : mostRecentSent;
    } else if (mostRecentReceived) {
      recentMessage = mostRecentReceived;
    } else if (mostRecentSent) {
      recentMessage = mostRecentSent;
    }

    if (recentMessage) {
      isRead = !!recentMessage.read_at;

      if (recentMessage.to_user_id === currentUserId) {
        senderFirstName = 'You:'; 
      }
    }

    return (
      <List.Item
        title={`${user.firstname} ${user.lastname}`}
        description={
          recentMessage
            ? `${senderFirstName} ${recentMessage.message}`
            : "No recent messages"
        } 
        left={(props) => (
          <CustomAvatar
            src={user?.media?.[0]?.original_url || ""}
            name={user.firstname}
            {...props}
          />
        )}
        right={(props) => <List.Icon {...props} icon="message-outline" />}
        onPress={() =>
          navigation.navigate("ChatConversation", { contact: user })
        }
        titleStyle={{ fontWeight: isRead ? "600" : "300" }}
        descriptionStyle={{ fontWeight: isRead ? "600" : "300" }}
      />
    );
  };

  return (
    <View>
      <Spinner visible={isLoading} color="#0A3480" animation="fade" />
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Messages" titleStyle={{ color: "white" }} />
      </Appbar.Header>
      <View style={{ padding: 5, height: "100%" }}>
        {!isLoading && (
          <FlatList
            data={data.users}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#f0f0f0" }} />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          />
        )}
      </View>
    </View>
  );
};

export default MessageList;
