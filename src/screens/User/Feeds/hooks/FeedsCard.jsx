import React, { useState, memo } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Divider, Portal, IconButton, Snackbar } from "react-native-paper";
import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useReactToPost } from "./useFeeds";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import moment from "moment";
import { useUser } from "../../../../hooks/useUser";

const MAX_LENGTH = 150;

const FeedsCard = ({ feed }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const formattedDate = moment(feed.published_at).fromNow();
  const { user } = useUser();
  const windowWidth = Dimensions.get('window').width;
  const maxWidth = Math.min(windowWidth, 768);
  const imageHeight = maxWidth * 9 / 10;
  const handleDownload = async () => {
    try {
      // Explanation to user for permission request
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need access to your photos to save the downloaded image. Please enable it in settings."
        );
        return;
      }

      const filename = FileSystem.documentDirectory + `upcare.jpg`;
      const downloadResult = await FileSystem.downloadAsync(feed.image, filename);
      if (downloadResult.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        toggleModal();
        Alert.alert("Download Success", "The image has been saved to your photo library.");
      } else {
        throw new Error("Failed to download image");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "There was an issue downloading or saving the image. Please try again.");
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(!isModalVisible);
  const toggleContent = () => setShowFullContent(!showFullContent);

  const ReactionButton = memo(({ postId, userReactions }) => {
    const { user } = useUser();
    const reactToPostMutation = useReactToPost();
    const reactionCount = userReactions.filter((react) => react.reaction === "love").length;
    const selectedReaction = userReactions.some((react) => react.user_id === user.id && react.reaction === "love");

    const handleReact = async () => {
      try {
        // Update selectedReaction immediately
        const newSelectedReaction = !selectedReaction;
        // Optimistic UI update
        // You can directly update the state or trigger a refresh from a parent component
        // For simplicity, I'm assuming you have a mechanism to handle optimistic updates
        // setUserReactions(newReactions); // Assuming setUserReactions is a state updater function
        // Make the actual API call
        reactToPostMutation.mutate({ postId, reaction: newSelectedReaction ? "love" : null });
      } catch (error) {
        console.error("Error reacting to post:", error);
      }
    };

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
        <TouchableOpacity onPress={handleReact} style={{ borderRadius: 50 }}>
          <Text style={{ color: selectedReaction ? "red" : "black", fontSize: 20 }}>
            {selectedReaction ? "❤️" : "🖤"}
          </Text>
        </TouchableOpacity>
        {reactionCount > 0 && <Text style={{ marginLeft: 5 }}>{reactionCount}</Text>}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.feedContainer}>
        <View style={styles.header}>
          <View style={styles.creatorInfo}>
            <Image source={require("../../../../../assets/icon.png")} style={styles.userImage} />
            <View>
              <Text style={styles.creatorName}>Upcare</Text>
              <Text style={styles.publishedDate}>{formattedDate}</Text>
            </View>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => setIsImageModalVisible(true)}>
          {feed.image && <Image source={{ uri: feed.image }} resizeMode="stretch" style={[styles.image, { height: imageHeight }]} />}
        </TouchableWithoutFeedback>

        <Text style={styles.content}>
          {showFullContent || feed.content.length <= MAX_LENGTH
            ? feed.content
            : `${feed.content.substring(0, MAX_LENGTH)}... `}
          {feed.content.length > MAX_LENGTH && (
            <Text style={styles.toggleButton} onPress={toggleContent}>
              {showFullContent ? " Show less" : "Show more"}
            </Text>
          )}
        </Text>

        <Divider style={{ marginVertical: 10 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ReactionButton postId={feed.id} reaction="love" userReactions={feed.reactions || []} />
        </View>

        <Portal>
          <ImageView
            images={[{ uri: feed.image }]}
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
                  <MaterialIcons name="more-vert" size={24} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
              </View>
            )}
            FooterComponent={() => (
              <View style={styles.footerContainer}>
                <Modal
                  isVisible={isModalVisible}
                  backdropOpacity={0.5}
                  onBackdropPress={toggleModal}
                  style={styles.modal}
                >
                  <View style={styles.modalContent}>
                    <TouchableOpacity onPress={handleDownload} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialIcons name="file-download" size={25} color="black" style={{ marginRight: 10 }} />
                      <Text style={{ fontSize: 16 }}>Save Image to Phone</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            )}
          />
        </Portal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8
  },
  feedContainer: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  creatorName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0A3480",
  },
  publishedDate: {
    fontSize: 10,
    color: "#888",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  content: {
    textAlign: "justify",
  },
  toggleButton: {
    color: "#0A3480",
    marginTop: 10,
    fontWeight: "bold",
  },
  containerImageView: {
    marginTop: 20,
    left: 310,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: "transparent",
    padding: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  closeText: {
    color: '#0A3480',
    fontWeight: 'bold',
    marginTop: 10,
  },
  footerContainer: {
    flex: 1,
  },
});

export default FeedsCard;
