import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { List, Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import useMessaging from "./hook/useMessaging";
import CustomAvatar from "../../components/CustomAvatar";

const MessageList = () => {
  const navigation = useNavigation();
  const { data, isFetching, isFetched, isRefetching, refetch, isLoading } = useMessaging();

  // Render individual list items
  const renderItem = ({ item }) => {
    const { user = {} } = item;
    const { id: currentUserId, firstname = "", lastname = "", media = [], received_messages = [], sent_messages = [] } = user;

    const mostRecentReceived = received_messages.at(-1);
    const mostRecentSent = sent_messages.at(-1);

    // Determine the most recent message between sent and received
    const recentMessage =
      mostRecentReceived && mostRecentSent
        ? new Date(mostRecentReceived.created_at) > new Date(mostRecentSent.created_at)
          ? mostRecentReceived
          : mostRecentSent
        : mostRecentReceived || mostRecentSent;

    // Check if the recent message is read
    const isRead = recentMessage?.to_user_id === currentUserId && !recentMessage?.read_at;

    // Prefix "You: " if the user is the sender
    const messagePrefix = recentMessage?.to_user_id === currentUserId ? "You: " : "";

    // Navigate to chat conversation
    const handlePress = () => navigation.navigate("ChatConversation", { contact: user });

    return (
      <List.Item
        title={`${firstname} ${lastname}`}
        description={recentMessage ? `${messagePrefix}${recentMessage.message}` : "No recent messages"}
        left={(props) => (
          <CustomAvatar
            src={media[0]?.original_url ?? ""}
            name={firstname}
            {...props}
          />
        )}
        right={(props) => <List.Icon {...props} icon="message-outline" />}
        onPress={handlePress}
        titleStyle={{ fontWeight: isRead ? "normal" : "bold" }}
        descriptionStyle={{ fontWeight: isRead ? "normal" : "bold" }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Spinner visible={isLoading} color="#0A3480" animation="fade" />
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Messages" titleStyle={{ color: "white" }} />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 5 }}>
        {!isLoading && (
          <FlatList
            data={data?.users || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
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
