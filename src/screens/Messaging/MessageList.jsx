import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { List, Appbar } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay";
import useMessaging from "./hook/useMessaging";
import CustomAvatar from "../../components/CustomAvatar";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../hooks/useUser";

const MessageList = () => {
  const navigation = useNavigation();
  const { data, isFetching, isFetched, isRefetching, refetch, isLoading } = useMessaging();
  const [messages, setMessages] = useState([]);
  const { user: currentUser } = useUser();

  useEffect(() => {
    if (isFetched) {
      setMessages(data?.users || []);
    }
  }, [data, isFetched]);

  const renderItem = ({ item }) => {
    const { user } = item;
    const { id: otherUserId, firstname, lastname, media = [], received_messages = [], sent_messages = [] } = user;

    console.log("Current User:", currentUser.name);
    console.log("Other User:", user.name);

    // Filter out users with no messages (either received or sent)
    const hasMessages = 
      (received_messages.length > 0 || sent_messages.length > 0) && 
      (received_messages.some(msg => msg.to_user_id === otherUserId || msg.from_user_id === otherUserId) || 
      sent_messages.some(msg => msg.to_user_id === otherUserId || msg.from_user_id === otherUserId));

    if (!hasMessages) return null;

    const handlePress = () => navigation.navigate("ChatConversation", { contact: user });

    const mostRecentReceived = received_messages.at(-1);
    const mostRecentSent = sent_messages.at(-1);

    const recentMessage = mostRecentReceived && mostRecentSent
      ? new Date(mostRecentReceived.created_at) > new Date(mostRecentSent.created_at)
        ? mostRecentReceived
        : mostRecentSent
      : mostRecentReceived || mostRecentSent;

    const messagePrefix = recentMessage?.to_user_id === otherUserId ? "You: " : "";

    // Log the recent message, user details, to_user_id, and to_user_name
    console.log(`Recent Message from ${firstname} ${lastname}:`, recentMessage);
    
    if (recentMessage) {
      const toUserId = recentMessage.to_user_id;
      let toUserName = "Unknown User";

      // Correctly identify the to_user based on the current user's ID
      if (toUserId === currentUser.id) {
        toUserName = `${firstname} ${lastname}`; // The message is directed to the other user
      } else if (toUserId === otherUserId) {
        toUserName = `${currentUser.firstname} ${currentUser.lastname}`; // The message is directed to the current user
      }

      console.log(`To User ID: ${toUserId}, To User Name: ${toUserName}`);
    }

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
        onPress={handlePress}
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
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.user.id}`}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      />
    </View>
  );
};

export default MessageList;
