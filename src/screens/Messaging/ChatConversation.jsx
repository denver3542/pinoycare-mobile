import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";
import { Appbar, Avatar, Card, Title, Paragraph } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fDate, fTimestamp } from "../../../utils/formatTime";
import moment from "moment";
import useMessaging, { useConvo } from "./hook/useMessaging";
import Ably from "ably/promises";
import { useUser } from "../../hooks/useUser";

const ChatConversation = () => {
  const { params } = useRoute();
  const contact = params.contact;
  const [text, setText] = useState("");
  const messages = contact.receivedMessages;
  const navigation = useNavigation();
  const { user } = useUser();

  // console.log(contact.receivedMessages);
  const { data, isFetched, isRefetching, refetch } = useConvo(contact.id);
  const [conversation, setConversation] = useState([]);
  const { sendMessage: send } = useMessaging();

  // Update to use useEffect for initializing conversation state
  useEffect(() => {
    if (isFetched) {
      setConversation(data?.conversations || []);
    }
  }, [data, isFetched]);

  useEffect(() => {
    if (data?.ablyApiKey && isFetched) {
      const ably = new Ably.Realtime.Promise({
        key: data.ablyApiKey,
        clientId: user.id.toString(),
      });

      const channelName = `private-chat-${Math.min(
        user?.id,
        contact.id
      )}-${Math.max(user.id, contact.id)}`;
      const channel = ably.channels.get(channelName);

      channel.subscribe("message", (message) => {
        const incomingMessage = {
          id: message.id,
          sender: { media: contact.media },
          message: message.data.message,
          created_at: message.timestamp,
          isCurrentUser: false,
        };

        setConversation((prevConvo) => [incomingMessage, ...prevConvo]);
      });

      return () => channel.unsubscribe();
    }
  }, [data?.ablyApiKey, user.id, contact.id, isFetched]);

  // This function would add a new message to the chat
  const sendMessage = async () => {
    if (text.trim()) {
      const newMessage = {
        id: "temp-" + Date.now(), // Temporary ID, replace with backend response if available
        message: text.trim(),
        created_at: new Date().toISOString(),
        isCurrentUser: true,
        // Add other necessary fields for your message object
      };
      // Add the new message to your state and send it to your backend
      try {
        await send(contact.id, text);

        setData([newMessage, ...conversation]);

        setText(""); // Reset the input field
        refetch();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const renderMessageItem = ({ item }) => {
    const isMyMessage = item.isCurrentUser;

    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!isMyMessage && (
          <Avatar.Image
            size={36}
            source={{ uri: item.sender.media[0].original_url }}
            style={styles.avatarStyle}
          />
        )}
        <Card
          style={[
            styles.cardStyle,
            {
              borderBottomRightRadius: isMyMessage ? 0 : 20,
              borderTopLeftRadius: !isMyMessage ? 0 : 20,
            },
          ]}
        >
          <Card.Content
            style={
              isMyMessage ? styles.myMessageContent : styles.theirMessageContent
            }
          >
            <Paragraph
              style={
                isMyMessage ? styles.myMessageText : styles.theirMessageText
              }
            >
              {item.message}
            </Paragraph>
            <Text style={styles.timeStampText}>
              {moment(item.created_at).format("HH:mm A")}
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 40}
    >
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Avatar.Image
          style={{ marginRight: 10 }}
          size={36}
          source={{ uri: contact.media[0].original_url }}
        />
        <Appbar.Content title={data?.otherUser?.name} />
        {/* <Appbar.Action icon="phone" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>

      {isFetched && (
        <FlatList
          inverted
          data={conversation}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your message"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" size={24} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  messageBubble: {
    marginVertical: 4,
    flexDirection: "row",
  },
  myMessage: {
    marginLeft: 40,
    alignSelf: "flex-end",
  },
  theirMessage: {
    marginRight: 40,
    alignSelf: "flex-start",
  },
  avatarStyle: {
    marginHorizontal: 6,
  },
  cardStyle: {
    borderRadius: 20,
  },
  myMessageContent: {
    backgroundColor: "#dcf8c6",
    borderBottomRightRadius: 0,
    borderRadius: 20,
  },
  theirMessageContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
    borderRadius: 20,
  },
  myMessageText: {
    color: "#000",
  },
  theirMessageText: {
    color: "#000",
  },
  timeStampText: {
    fontSize: 10,
    alignSelf: "flex-end",
    color: "grey",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#f5f5f6",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default ChatConversation;
