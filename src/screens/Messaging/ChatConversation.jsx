import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  RefreshControl,
  Platform,
  Image,
  Dimensions,
  Linking,
  Keyboard,
} from "react-native";
import {
  Appbar,
  Avatar,
  Card,
  Divider,
  IconButton,
  List,
  Modal,
  Paragraph,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import useMessaging, { useConvo } from "./hook/useMessaging";
import Ably from "ably/promises";
import { useUser } from "../../hooks/useUser";
import ImageView from "react-native-image-viewing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./style";
import * as MediaLibrary from "expo-media-library";
import CustomAvatar from "../../components/CustomAvatar";
import Spinner from "react-native-loading-spinner-overlay";

const ChatConversation = () => {
  const { params } = useRoute();
  const { colors } = useTheme();
  const contact = params.contact;
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [images, setImages] = useState([]);
  const navigation = useNavigation();
  const { user } = useUser();
  const { data, isFetched, isRefetching, refetch } = useConvo(contact.id);
  const [conversation, setConversation] = useState([]);
  const { send } = useMessaging();
  const messagesEndRef = useRef(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => {
    Keyboard.dismiss();
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  useEffect(() => {
    if (isFetched) {
      setConversation(data?.conversations || []);
    }
  }, [data, isFetched]);

  const toggleModal = () => setIsImageModalVisible(!isModalVisible);

  const sendMessage = async () => {
    console.log("Attempting to send message");
  
    if (text.trim() || attachedFiles.length > 0) {
      const formData = new FormData();
      formData.append("message", text.trim());
      console.log("Message content:", text.trim());
  
      if (!contact || !contact.id) {
        console.error("Contact or contact ID is undefined");
        return;
      }
  
      formData.append("to_user_id", contact.id);
      console.log("Message destination user ID:", contact.id);
  
      if (replyTo && replyTo.id) {
        formData.append("reply_to_id", replyTo.id);
        console.log("Replying to message ID:", replyTo.id);
      }
  
      attachedFiles.forEach((file) => {
        console.log(`Attaching file: ${file.name}`);
        formData.append("files[]", {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      });
  
      try {
        await send(formData); // Using the mutation function `send`
        console.log("Message sent successfully");
        refetch(); // Refetch inbox after sending the message
        setText("");
        setReplyTo(null);
        setAttachedFiles([]);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.log("No message text or attachments provided to send.");
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
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileName = uri.split("/").pop();
        const fileType = result.assets[0].mimeType; 
        setAttachedFiles([
          ...attachedFiles,
          { uri: uri, type: fileType, name: fileName },
        ]);
        toggleBottomSheet();
      }
    } catch (err) {
      console.error("Error picking document: ", err);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileName = uri.split("/").pop();
        const fileType = "image/jpeg"; 
        setAttachedFiles([
          ...attachedFiles,
          { uri: uri, type: fileType, name: fileName },
        ]);
        toggleBottomSheet();
      }
    } catch (err) {
      console.error("Error picking image: ", err);
    }
  };

  const renderAttachedFiles = () => {
    return attachedFiles.map((file, index) => (
      <View key={index} style={styles.attachmentContainer}>
        {file.type.startsWith("image/") ? (
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

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need access to your photos to save the downloaded image. Please enable it in settings."
        );
        return;
      }

      const filename = FileSystem.documentDirectory + `upcare.jpg`;
      const downloadResult = await FileSystem.downloadAsync(
        feed.image,
        filename
      );
      if (downloadResult.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        toggleModal();
        Alert.alert(
          "Download Success",
          "The image has been saved to your photo library."
        );
      } else {
        throw new Error("Failed to download image");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert(
        "Error",
        "There was an issue downloading or saving the image. Please try again."
      );
    }
  };

  const viewImages = (uri) => {
    setIsImageModalVisible(true);
    setImages([{ uri: uri }]);
  };

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
      channel.subscribe('message', (message) => {
        const { data } = message;
    
        if (data) {
            // Validate if required properties are present
            if (data.from_user_id && data.to_user_id) {
                console.log("Received message:", data);
                refetch();
            } else {
                console.error("Received an undefined or malformed message:", message);
            }
        } else {
            console.error("Received an empty message:", message);
        }
    });
    
      // channel.subscribe("message", (message) => {
        
      //   try {
      //     if (!message || !message.data || !message.data.message) {
      //       console.error(
      //         "Received an undefined or malformed message:",
      //         message
      //       );
      //       return;
      //     }
      //     refetch();
      //   } catch (error) {
      //     console.error("Error processing incoming message:", error);
      //   }
      // });

      return () => channel.unsubscribe();
    }
  }, [data?.ablyApiKey, user.id, contact.id, isFetched]);

  const renderMessageItem = ({ item }) => {
    if (!item) {
      console.error("Message item is undefined");
      return null;
    }
    const isMyMessage = item.isCurrentUser;
    const repliedMessage = item.reply_to;

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
              <CustomAvatar
                src={item.sender?.media[0]?.original_url}
                name={item.sender.firstname}
                style={[styles.avatarStyle]}
                size={30}
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
                      if (type === "image/png" || type === "image/jpeg") {
                        return (
                          <TouchableWithoutFeedback
                            key={key}
                            onPress={() => viewImages(file.original_url)}
                          >
                            <Image
                              source={{ uri: file.original_url }}
                              resizeMode="cover"
                              style={{ width: 100, height: 100, margin: 5 }}
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
            images={images}
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
      <Spinner visible={isLoading} color="#0A3480" animation="fade" />
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <CustomAvatar
          src={contact.media[0]?.original_url}
          name={contact.firstname}
          style={{ marginRight: 10 }}
          size={34}
        />
        <Appbar.Content title={data?.otherUser?.name} />
      </Appbar.Header>

      {isFetched && (
        <FlatList
          ref={messagesEndRef}
          inverted
          data={conversation}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
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
      <View style={styles.attachedFilesContainer}>{renderAttachedFiles()}</View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleBottomSheet}>
          <MaterialCommunityIcons name="plus" size={24} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Write your message"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!text.trim() && attachedFiles.length === 0}
          style={{
            display:
              !text.trim() && attachedFiles.length === 0 ? "none" : "flex",
          }}
        >
          <MaterialCommunityIcons
            name="send"
            size={24}
            color={
              !text.trim() && attachedFiles.length === 0
                ? "gray"
                : colors.primary
            }
          />
        </TouchableOpacity>
      </View>
      <Portal>
        <Modal
          visible={isBottomSheetVisible}
          onDismiss={toggleBottomSheet}
          style={styles.bottomModal}
          contentContainerStyle={styles.bottomModalContent}
        >
          <List.Section>
            <List.Subheader>Content and tools</List.Subheader>
            <Divider />
            <List.Item
              title="Image"
              left={() => <MaterialCommunityIcons name="image" size={24} />}
              onPress={pickImage}
            />
            <Divider />
            <List.Item
              title="Files"
              left={() => (
                <MaterialCommunityIcons name="file-document" size={24} />
              )}
              onPress={pickDocument}
            />
          </List.Section>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
};

export default ChatConversation;
