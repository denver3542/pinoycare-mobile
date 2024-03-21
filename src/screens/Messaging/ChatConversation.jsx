import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { Appbar, Avatar, Card, Title, Paragraph } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const sampleMessages = [
  {
    id: "m1",
    text: "Hello sir, Good Morning",
    isIncoming: false,
    timestamp: "09:30 am",
    isRead: true,
  },
  {
    id: "m2",
    text: "Morning, Can I help you?",
    isIncoming: true,
    timestamp: "09:31 am",
    isRead: true,
  },
  {
    id: "m3",
    text: "I saw the UI/UX Designer vacancy that you uploaded on LinkedIn yesterday and I am interested in joining your company.",
    isIncoming: false,
    timestamp: "09:33 am",
    isRead: true,
  },
  {
    id: "m4",
    text: "Oh yes, please send your CV/Resume here",
    isIncoming: true,
    timestamp: "09:35 am",
    isRead: true,
  },
  {
    id: "m5",
    text: "Jamet - CV - UI/UX Designer.PDF",
    isIncoming: false,
    timestamp: "09:36 am",
    isFile: true,
    fileSize: "867 KB PDF",
    isRead: true,
  },
];

const ChatConversation = () => {
  const [text, setText] = useState("");
  const navigation = useNavigation();
  const { params } = useRoute();

  const contact = params.contact;
  console.log(contact);

  // This function would add a new message to the chat
  const sendMessage = () => {
    if (text.trim()) {
      // Add the new message to your state and send it to your backend
      setText(""); // Reset the input field
    }
  };

  const renderMessageItem = ({ item }) => {
    const isMyMessage = !item.isIncoming;

    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Card style={styles.cardStyle}>
          {/* {!isMyMessage && (
            <Avatar.Image
              size={36}
              source={{ uri: contact.avatar }}
              style={styles.avatarStyle}
            />
          )} */}
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
              {item.text}
            </Paragraph>
            <Text style={styles.timeStampText}>{item.timestamp}</Text>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Avatar.Image size={36} source={{ uri: contact.avatar }} />
        <Appbar.Content title={contact.name} />
        <Appbar.Action icon="phone" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      <FlatList
        inverted
        data={sampleMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

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
    maxWidth: "80%",
    borderRadius: 20,
  },
  myMessageContent: {
    backgroundColor: "#dcf8c6",
    borderBottomRightRadius: 0,
  },
  theirMessageContent: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 0,
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
