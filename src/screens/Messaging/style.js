import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
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
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    padding: 10,
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
    fontSize: 16,
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
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },




  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomModalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "space-around",
  },
  bottomModalButton: {
    flexDirection: "row",
    alignItems: "left",
  },
});
