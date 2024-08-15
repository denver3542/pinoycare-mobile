import { MaterialIcons } from "@expo/vector-icons";
import { Linking, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-elements";
import {
  PanGestureHandler,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  Avatar,
  Card,
  IconButton,
  Modal,
  Paragraph,
  Portal,
  Text,
} from "react-native-paper";
import { styles } from "./style";
import moment from "moment";
import ImageView from "react-native-image-viewing";

export const renderMessageItem = ({ item }) => {
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
                  ? [styles.myMessageContent, { backgroundColor: "#09b36c" }]
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
