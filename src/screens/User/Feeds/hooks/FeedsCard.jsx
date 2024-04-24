import React, { useState, useRef, ref } from "react";
import Modal from "react-native-modal";
import ImageView from "react-native-image-viewing";
import { Image, StyleSheet, Text, TouchableOpacity, View, NetInfo } from "react-native";
import { Divider, IconButton, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useReactToPost } from "./useFeeds";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import moment from "moment";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";




const MAX_LENGTH = 300;

const FeedsCard = ({ feed }) => {
  const theme = useTheme();
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const reactToPostMutation = useReactToPost();
  const formattedDate = moment(feed.published_at).fromNow();

  const handleReact = async (reaction) => {
    try {
      const newReaction = selectedReaction === reaction ? null : reaction;
      await reactToPostMutation.mutateAsync({ postId: feed.id, reaction: newReaction });
      setSelectedReaction(newReaction);
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
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


  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


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
          <Image source={{ uri: feed.image }} style={styles.image} />
        </TouchableWithoutFeedback>

        <Text style={styles.content}>
          {showFullContent || feed.content.length <= MAX_LENGTH ? feed.content : `${feed.content.substring(0, MAX_LENGTH)}...`}
        </Text>

        {feed.content.length > MAX_LENGTH && (
          <TouchableOpacity onPress={() => setShowFullContent(!showFullContent)}>
            <Text style={styles.toggleButton}>{showFullContent ? "Show Less" : "Show More"}</Text>
          </TouchableOpacity>
        )}
        <Divider style={{ marginVertical: 10 }} />
        <IconButton
          icon={selectedReaction === "love" ? "heart" : "heart-outline"}
          size={24}
          color={selectedReaction === "love" ? theme.colors.red : theme.colors.black}
          onPress={() => handleReact("love")}
        />

        <ImageView
          images={[
            {
              uri: feed.image,
            },
          ]}
          imageIndex={0}
          animationType="fade"
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
                animationOutTiming={300}
                onBackdropPress={toggleModal}
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

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
