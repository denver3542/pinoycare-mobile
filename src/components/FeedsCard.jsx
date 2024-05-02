import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Divider, IconButton, Portal } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useReactToPost } from "../screens/User/Feeds/hooks/useFeeds";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ImageView from "react-native-image-viewing";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Modal from "react-native-modal";
const MAX_LENGTH = 300;

const FeedsCard = ({ feed }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const reactToPostMutation = useReactToPost();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Permission to access media library denied");

      const filename = FileSystem.documentDirectory + "${feed.name}.jpg";
      const downloadResult = await FileSystem.downloadAsync(feed.image, filename);
      if (downloadResult.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        toggleModal();
      } else {
        throw new Error("Failed to download image");
      }
    } catch (error) {
      console.error("Error downloading image:", error);

    }
  };
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
            source={require("../../assets/icon.png")}
            style={styles.userImage}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.creatorName}>Upcare</Text>
            <Text style={styles.publishedDate}>{formattedDate}</Text>
          </View>
        </View>

      </View>
      <TouchableWithoutFeedback onPress={() => setIsImageModalVisible(true)}>
        {feed.image && <Image source={{ uri: feed.image }} style={styles.image} />}
      </TouchableWithoutFeedback>
      <Text style={styles.content}>
        {showFullContent || feed.content.length <= MAX_LENGTH
          ? feed.content
          : `${feed.content.substring(0, MAX_LENGTH)}... `}
        {feed.content.length > MAX_LENGTH && (
          <Text style={styles.toggleButton} onPress={toggleContent}>
            {showFullContent ? "" : "Show More"}
          </Text>
        )}
      </Text>




      <Portal>
        <ImageView
          images={[{ uri: feed.image, },]}
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
                <TouchableOpacity onPress={toggleModal}>
                  <MaterialIcons name="more-vert" size={24} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
              </View>
            </View>

          )}
          FooterComponent={() => (
            <View style={styles.footerContainer}>
              <Modal
                animationType="slide"
                transparent={true}
                isVisible={isModalVisible}
                avoidKeyboard={true}
                hasBackdrop={true}
                backdropColor="transparent"
                coverScreen={true}
                animationIn="slideInUp"
                animationInTiming={300}
                animationOut="slideOutDown"
                animationOutTiming={400}
                onBackdropPress={toggleModal}
                swipeToCloseEnabled={true}

                style={styles.modal}
              >
                <View style={{ justifyContent: 'flex-end' }}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity onPress={handleDownload} style={{ flexDirection: 'row' }}>
                      <MaterialIcons name="file-download" size={25} color="black" style={{ marginRight: 10 }} />
                      <Text style={{ fontSize: 16 }}>Save Image to Phone</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
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
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    textAlign: "justify",
  },
  toggleButton: {
    color: "#0A3480",
    // marginTop: 10,
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
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
});


export default FeedsCard;
