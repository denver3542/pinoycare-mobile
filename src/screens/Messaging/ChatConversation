import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  RefreshControl,
  Platform,
  Image,
  Dimensions,
  Linking,
} from "react-native";
import {
  Appbar,
  Avatar,
  Card,
  IconButton,
  Modal,
  Paragraph,
  Portal,
} from "react-native-paper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import useMessaging, { useConvo } from "./hook/useMessaging";
import Ably from "ably/promises";
import { useUser } from "../../hooks/useUser";
import ImageView from "react-native-image-viewing";

const ChatConversation = () => {
  const { params } = useRoute();
  const contact = params.contact;
  const [text, setText] = useState("");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const navigation = useNavigation();
  const { user } = useUser();
  const { data, isFetched, isRefetching, refetch } = useConvo(contact.id);
  const [conversation, setConversation] = useState([]);
  const { sendMessage: send } = useMessaging();
  const messagesEndRef = useRef(null);
  const handleDownload = async () => {
    // try {
    //   // Explanation to user for permission request
    //   const { status } = await MediaLibrary.requestPermissionsAsync();
    //   if (status !== "granted") {
    //     Alert.alert(
    //       "Permission Denied",
    //       "We need access to your photos to save the downloaded image. Please enable it in settings."
    //     );
    //     return;
    //   }
    //   const filename = FileSystem.documentDirectory + `upcare.jpg`;
    //   const downloadResult = await FileSystem.downloadAsync(
    //     feed.image,
    //     filename
    //   );
    //   if (downloadResult.status === 200) {
    //     await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
    //     toggleModal();
    //     Alert.alert(
    //       "Download Success",
    //       "The image has been saved to your photo library."
    //     );
    //   } else {
    //     throw new Error("Failed to download image");
    //   }
    // } catch (error) {
    //   console.error("Error downloading image:", error);
    //   Alert.alert(
    //     "Error",
    //     "There was an issue downloading or saving the image. Please try again."
    //   );
    // }
  };

  const windowWidth = Dimensions.get("window").width;
  const maxWidth = Math.min(windowWidth, 768);
  const imageHeight = (maxWidth * 9) / 10;
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

  const toggleModal = () => setModalVisible(!isModalVisible);

  const sendMessage = async () => {
    if (text.trim() || attachedFiles.length > 0) {
      const newMessage = {
        id: "temp-" + Date.now(),
        message: text.trim(),
        created_at: new Date().toISOString(),
        isCurrentUser: true,
        replyTo,
        // files: attachedFiles,
      };

      try {
        const formData = new FormData();
        formData.append("message", text.trim());
        formData.append("to_user_id", contact.id);
        // attachedFiles.forEach((file) => {
        //   formData.append("files[]", {
        //     uri: file.uri,
        //     type: file.mimeType,
        //     name: file.name,
        //   });
        // });
        // if (replyTo) {
        //   formData.append("reply_to_id", replyTo.id);
        // }

        await send(formData);

        // setConversation([newMessage, ...conversation]);
        setText("");
        setReplyTo(null);
        setAttachedFiles([]);
        refetch();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const handleMessageClick = (messageId) => {
    const index = conversation.findIndex((message) => message.id === messageId);
    if (index !== -1) {
      messagesEndRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      setAttachedFiles([...attachedFiles, result]);
    }
  };

  const renderAttachedFiles = () => {
    return attachedFiles.map((file, index) => (
      <View key={index} style={styles.attachmentContainer}>
        {file.mimeType.startsWith("image/") ? (
          <Image source={{ uri: file.uri }} style={styles.attachmentImage} />
        ) : (
          <Text style={styles.attachmentText}>{file.name}</Text>
        )}
        <TouchableOpacity onPress={() => removeFile(index)}>
          <MaterialCommunityIcons name="close" size={24} />
        </TouchableOpacity>
      </View>
    ));
  };

  const removeFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const onGestureEvent = ({ nativeEvent }, message) => {
    if (nativeEvent.translationX > 100 || nativeEvent.translationX < -100) {
      setReplyTo(message);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isMyMessage = item.isCurrentUser;
    console.log(item);
    const repliedMessage = item.replyTo
      ? conversation.find((msg) => msg.id === item.replyTo.id)
      : null;

    return (
      <>
        <PanGestureHandler
          onGestureEvent={(e) => onGestureEvent(e, item)}
          onHandlerStateChange={(e) => onGestureEvent(e, item)}
        >
          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myMessage : styles.theirMessage,
            ]}
          >
            {!isMyMessage && (
              <Avatar.Image
                size={36}
                source={{ uri: item.sender?.media[0]?.original_url }}
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
                  isMyMessage
                    ? styles.myMessageContent
                    : styles.theirMessageContent
                }
              >
                {repliedMessage && (
                  <TouchableOpacity
                    onPress={() => handleMessageClick(repliedMessage.id)}
                  >
                    <Paragraph style={styles.replyText}>
                      Replying to: {repliedMessage.message}
                    </Paragraph>
                  </TouchableOpacity>
                )}

                <View style={{ flex: 1, flexDirection: "row" }}>
                  {item.media?.length > 0 &&
                    item.media.map((file, key) => {
                      const type = file.mime_type;
                      if (type == "image/png" || type == "image/jpeg") {
                        return (
                          <TouchableWithoutFeedback
                            key={key}
                            onPress={() => setIsImageModalVisible(true)}
                          >
                            <Image
                              source={{ uri: file.original_url }}
                              resizeMode="cover"
                              style={[
                                {
                                  width: 100,
                                  height: 100,
                                  margin: 5,
                                },
                              ]}
                            />
                          </TouchableWithoutFeedback>
                        );
                      }
                      return (
                        <IconButton
                          key={key}
                          icon="file"
                          size={20}
                          onPress={() => {
                            Linking.openURL(file?.original_url).catch((err) =>
                              console.error("Error occurred", err)
                            );
                          }}
                        />
                      );
                    })}
                </View>
                <Paragraph
                  style={
                    isMyMessage ? styles.myMessageText : styles.theirMessageText
                  }
                >
                  {/* {JSON.stringify(item.media[0]?.original_url)} */}
                  {item.message}
                </Paragraph>
                {item.files &&
                  item.files.map((file, index) => (
                    <View key={index} style={styles.fileContainer}>
                      {file.mimeType.startsWith("image/") ? (
                        <Image
                          source={{ uri: file.uri }}
                          style={styles.fileImage}
                        />
                      ) : (
                        <Text style={styles.fileText}>{file.name}</Text>
                      )}
                    </View>
                  ))}
                <Text style={styles.timeStampText}>
                  {moment(item.created_at).format("HH:mm A")}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </PanGestureHandler>

        <Portal>
          <ImageView
            images={[{ uri: item.media[0]?.original_url }]}
            presentationStyle="fullScreen"
            imageIndex={0}
            animationType="fade"
            onRequestClose={() => setIsImageModalVisible(false)}
            swipeToCloseEnabled={true}
            visible={isImageModalVisible}
            HeaderComponent={() => (
              <View style={styles.containerImageView}>
                <TouchableOpacity onPress={() => setIsImageModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleModal}>
                  <MaterialIcons
                    name="more-vert"
                    size={24}
                    color="white"
                    style={{ marginLeft: 20 }}
                  />
                </TouchableOpacity>
              </View>
            )}
            FooterComponent={() => (
              <View style={{ flex: 1 }}>
                <Modal
                  isVisible={isModalVisible}
                  backdropOpacity={0.5}
                  onBackdropPress={toggleModal}
                  style={styles.modal}
                >
                  <View style={styles.modalContent}>
                    <TouchableOpacity
                      onPress={handleDownload}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialIcons
                        name="file-download"
                        size={25}
                        color="black"
                        style={{ marginRight: 10 }}
                      />
                      <Text style={{ fontSize: 16 }}>Save Image to Phone</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            )}
          />
        </Portal>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 40}
    >
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Avatar.Image
          style={{ marginRight: 10 }}
          size={36}
          source={{ uri: contact.media[0]?.original_url }}
        />
        <Appbar.Content title={data?.otherUser?.name} />
      </Appbar.Header>

      {isFetched && (
        <FlatList
          ref={messagesEndRef}
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

      {replyTo && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyText}>Replying to: {replyTo.message}</Text>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <MaterialCommunityIcons name="close" size={20} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickDocument}>
          <MaterialCommunityIcons name="attachment" size={24} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Write your message"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={sendMessage}>
          <MaterialCommunityIcons name="send" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.attachedFilesContainer}>{renderAttachedFiles()}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  containerImageView: {
    marginTop: 40,
    left: 310,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    padding: 10,
  },
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
  replyText: {
    fontStyle: "italic",
    color: "#888",
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
  replyContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  attachedFilesContainer: {
    paddingHorizontal: 10,
  },
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  attachmentText: {
    flex: 1,
    marginRight: 10,
  },
  fileContainer: {
    marginTop: 10,
  },
  fileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  fileText: {
    marginTop: 5,
  },
});

export default ChatConversation;
