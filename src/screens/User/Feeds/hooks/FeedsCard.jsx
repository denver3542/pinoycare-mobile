import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Divider, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useReactToPost } from "./useFeeds.js";

const MAX_LENGTH = 300;

const FeedsCard = ({ feed }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null); // Default reaction
  const [modalVisible, setModalVisible] = useState(false);
  const reactToPostMutation = useReactToPost(); // Initialize the mutation hook

  // useEffect(() => {
  //   // Set the initial selected reaction based on the user's reaction in the feed
  //   setSelectedReaction(feed.reactions.find((reaction) => reaction.user_id === feed.user.id)?.reaction || null);
  // }, [feed]);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const formattedDate = moment(feed.published_at).fromNow();

  const handleReact = async (reaction) => {
    try {
      await reactToPostMutation.mutateAsync({
        postId: feed.id,
        reaction,
      });
      setSelectedReaction(reaction);
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

  const handleLongPress = () => {
    setModalVisible(true);
  };

  const selectReaction = (reaction) => {
    setSelectedReaction(reaction);
    setModalVisible(false);
    handleReact(reaction);
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
      {feed.image ? (
        <Image source={{ uri: feed.image }} style={styles.image} />
      ) : null}
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
      <MaterialCommunityIcons
        name={
          selectedReaction === "like"
            ? "thumb-up"
            : selectedReaction === "dislike"
              ? "thumb-down"
              : selectedReaction === "love"
                ? "heart"
                : "thumb-up-outline"
        }
        size={24}
        color={
          selectedReaction
            ? selectedReaction === "love"
              ? "red"
              : "black"
            : "black"
        }
        onPress={() => handleReact(selectedReaction ? null : "love")}
        onLongPress={handleLongPress}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <IconButton
              icon="thumb-up"
              color={selectedReaction === "like" ? "blue" : "black"}
              onPress={() => selectReaction("like")}
            />
            <IconButton
              icon="thumb-down"
              color={selectedReaction === "dislike" ? "blue" : "black"}
              onPress={() => selectReaction("dislike")}
            />
            <IconButton
              icon="heart"
              color={selectedReaction === "love" ? "red" : "black"}
              onPress={() => selectReaction("love")}
            />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default FeedsCard;
