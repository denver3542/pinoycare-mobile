import React, { useState } from "react";
import moment from "moment";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Divider, IconButton, Modal, Portal, Button } from "react-native-paper";
import { useReactToPost } from "./useFeeds";

const MAX_LENGTH = 300;

const FeedsCard = ({ feed }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const reactToPostMutation = useReactToPost();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const showFeedImageModal = () => setIsImageModalVisible(true);
  const hideFeedImageModal = () => setIsImageModalVisible(false);

  const toggleContent = () => setShowFullContent(!showFullContent);

  const formattedDate = moment(feed.published_at).fromNow();

  const handleReact = async (reaction) => {
    try {
      if (selectedReaction === reaction) {
        await reactToPostMutation.mutateAsync({
          postId: feed.id,
          reaction: null,
        });
        setSelectedReaction(null);
      } else {
        await reactToPostMutation.mutateAsync({
          postId: feed.id,
          reaction,
        });
        setSelectedReaction(reaction);
      }
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

  return (
    <View style={styles.feedContainer}>
      <View style={styles.header}>
        <View style={styles.creatorInfo}>
          <Image
            source={require("../../../../../assets/icon.png")}
            style={styles.userImage}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.creatorName}>Upcare</Text>
            <Text style={styles.publishedDate}>{formattedDate}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={showFeedImageModal}>
        <Image source={{ uri: feed.image }} style={styles.image} />
      </TouchableOpacity>

      <Text style={styles.content}>
        {showFullContent || feed.content.length <= MAX_LENGTH
          ? feed.content
          : `${feed.content.substring(0, MAX_LENGTH)}...`}
      </Text>

      {feed.content.length > MAX_LENGTH && (
        <TouchableOpacity onPress={toggleContent}>
          <Text style={styles.toggleButton}>
            {showFullContent ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}

      <Divider style={{ marginVertical: 10 }} />

      <IconButton
        icon={selectedReaction === "love" ? "heart" : "heart-outline"}
        size={24}
        color={selectedReaction === "love" ? "red" : "black"}
        onPress={() => handleReact("love")}
      />

      <Portal>
        <Modal visible={isImageModalVisible} onDismiss={hideFeedImageModal} contentContainerStyle={styles.modal}>
          <Image source={{ uri: feed.image }} style={styles.modalImage} />
          <Button mode="contained" onPress={hideFeedImageModal} style={styles.modalButton}>
            Close
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    marginBottom: 8,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 1,
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
  modal: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "100%",
    height: 350,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
  },
});

export default FeedsCard;
