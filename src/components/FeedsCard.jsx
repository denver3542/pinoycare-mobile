import React, { useState, memo } from "react";
import moment from "moment";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Button,
  Divider,
  Portal,
  Modal as PaperModal,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useReactToPost } from "../screens/User/Feeds/hooks/useFeeds";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ImageView from "react-native-image-viewing";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import RNModal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../hooks/useUser";

const MAX_LENGTH = 150;

const ReactionButton = memo(
  ({ postId, userReactions, setShowSignInModal }) => {
    const { user, isAuthenticated } = useUser();
    const navigation = useNavigation();
    const reactionCount = userReactions.filter(
      (react) => react.reaction === "love"
    ).length;
    const selectedReaction = userReactions.some(
      (react) =>
        react.user_id === (user ? user.id : null) && react.reaction === "love"
    );

    const handleReact = async () => {
      if (!isAuthenticated) {
        setShowSignInModal(true);
        return;
      }
      try {
        const newSelectedReaction = !selectedReaction;
        reactToPostMutation.mutate({
          postId,
          reaction: newSelectedReaction ? "love" : null,
        });
      } catch (error) {
        console.error("Error reacting to post:", error);
      }
    };

    const handleSignIn = () => {
      setShowSignInModal(false);
      navigation.navigate("Login");
    };

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={handleReact} style={{ borderRadius: 50 }}>
          <Text style={{ color: selectedReaction ? "red" : "black", fontSize: 20 }}>
            {selectedReaction ? "❤️" : "❤️"}
          </Text>
        </TouchableOpacity>
        {reactionCount > 0 && <Text style={{ marginLeft: 5 }}>{reactionCount}</Text>}
      </View>
    );
  }
);

const FeedsCard = ({ feed, setShowSignInModal }) => {
  const navigation = useNavigation();
  const [showFullContent, setShowFullContent] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const reactToPostMutation = useReactToPost();
  const windowWidth = Dimensions.get('window').width;
  const imageHeight = windowWidth * 9 / 12; // Aspect ratio 16:9

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const formattedDate = moment(feed.published_at).fromNow();

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Permission to access media library denied");

      const filename = FileSystem.documentDirectory + `${feed.name}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(feed.image, filename);
      if (downloadResult.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
      } else {
        throw new Error("Failed to download image");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleLongPress = () => {
    setIsImageModalVisible(true);
  };

  return (
    <View style={styles.feedContainer}>
      <View style={styles.header}>
        <View style={styles.creatorInfo}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.userImage}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.creatorName}>Upcare</Text>
            <Text style={styles.publishedDate}>{formattedDate}</Text>
          </View>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={handleLongPress}>
        {feed.image && (
          <Image
            source={{ uri: feed.image }}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="stretch"
          />
        )}
      </TouchableWithoutFeedback>
      <Text style={styles.content}>
        {showFullContent || feed.content.length <= MAX_LENGTH
          ? feed.content
          : `${feed.content.substring(0, MAX_LENGTH)}... `}
        {feed.content.length > MAX_LENGTH && (
          <Text style={styles.toggleButton} onPress={toggleContent}>
            {showFullContent ? " Show less" : "Show More"}
          </Text>
        )}
      </Text>

      <Divider style={{ marginVertical: 10 }} />
      <ReactionButton
        postId={feed.id}
        userReactions={feed.reactions || []}
        setShowSignInModal={setShowSignInModal}
      />

      <Portal>
        <ImageView
          images={[{ uri: feed.image }]}
          presentationStyle="fullScreen"
          imageIndex={0}
          animationType="none"
          onRequestClose={() => setIsImageModalVisible(false)}
          swipeToCloseEnabled={true}
          visible={isImageModalVisible}
          HeaderComponent={() => (
            <View>
              <View style={styles.containerImageView}>
                <TouchableOpacity onPress={() => setIsImageModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownload}>
                  <MaterialIcons name="file-download" size={24} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
    borderRadius: 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    textAlign: "justify",
  },
  toggleButton: {
    color: "#0A3480",
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
});

export default FeedsCard;
