import React, { useState, useEffect } from "react";
import {
  Chip,
  Divider,
  IconButton,
  Snackbar,
  Button,
  useTheme,
  Appbar,
  Portal,
  Modal,
} from "react-native-paper";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SkillsChip from "./Profile/Skills/SkillsCardList";
import SeminarsTrainings from "./Profile/SeminarsAndTrainings/SeminarsTrainingsCardList";
import EducationItem from "./Profile/Education/EducationCardList";
import WorkExperience from "./Profile/WorkExperience/WorkExperienceCardList";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import * as AppleAuthentication from "expo-apple-authentication";

const Account = ({ activeNav }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, isFetched, refetchUser, city, linkAppleAccount } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const onRefresh = () => {
    setRefreshing(true);
    refetchUser()
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleChipPress = () => {
    showModal();
  };

  const handleModalClose = () => {
    hideModal();
    if (user?.status === "created" || user?.status === "rejected") {
      navigation.navigate("WalkThroughVerificationScreen");
    }
  };

  const handleButtonPress = () => {
    hideModal();
    if (user?.status === "created" || user?.status === "rejected") {
      navigation.navigate("WalkThroughVerificationScreen");
    }
  };

  const handleLinkAppleAccount = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Send the credential to your backend
      const response = await linkAppleAccount(credential);

      if (response.success) {
        Alert.alert("Success", response.message);
        refetchUser(); // Refresh user data
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        Alert.alert("Apple Sign-In was canceled.");
      } else {
        console.error(e);
        Alert.alert("Apple Sign-In failed.");
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          progressViewOffset={100}
        />
      }
    >
      <View>
        <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
          <Image
            source={require("../../../assets/pinoycare.png")}
            style={styles.imageStyle}
          />
          <Appbar.Content title="Account" titleStyle={{ color: "white" }} />
          <Appbar.Action
            icon={() => (
              <MaterialIcons name="more-vert" size={24} color="white" />
            )}
            onPress={() => navigation.navigate("SettingsScreen")}
          />
        </Appbar.Header>

        <View style={styles.contentStyle}>
          <View style={styles.userInfo}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  user && user.media[0]
                    ? { uri: user.media[0].original_url }
                    : require("../../../assets/images/sample-profile.jpg")
                }
                style={styles.profileImage}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.headerName}>{user?.name || ""}</Text>
                </View>
                <View style={{ marginBottom: 5 }}>
                  <View style={{ flexDirection: "row" }}>
                    <MaterialIcons
                      name="work"
                      size={14}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.headerProfession}>
                      {user?.profession || "n/a"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 0 }}>
                    <MaterialIcons
                      name="location-on"
                      size={14}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.headerText}>
                      {user?.city || "n/a"}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 0,
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons
                      name="email"
                      size={14}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.headerText}>
                      {user?.email || "n/a"}{" "}
                    </Text>
                  </View>
                </View>

                <View style={{ flexWrap: "wrap", marginTop: 2 }}>
                  <Chip
                    onPress={handleChipPress}
                    icon={({ size, color }) =>
                      user?.status === "pending" ? (
                        <MaterialIcons
                          name="hourglass-top"
                          size={12}
                          color={color}
                        />
                      ) : user?.status === "created" ? (
                        <MaterialIcons name="shield" size={12} color={color} />
                      ) : user?.status === "approved" ? (
                        <MaterialIcons
                          name="verified"
                          size={12}
                          color={color}
                        />
                      ) : (
                        <MaterialIcons name="gpp-bad" size={12} color={color} />
                      )
                    }
                    compact
                    style={{ backgroundColor: "white", borderRadius: 8 }}
                    textStyle={{
                      color: "black",
                      fontSize: 10,
                      fontWeight: "bold",
                      minHeight: 10,
                      lineHeight: 12,
                      alignItems: "center",
                      marginVertical: 2,
                    }}
                  >
                    {user?.status === "approved"
                      ? "Verified"
                      : user?.status === "rejected"
                        ? "Rejected"
                        : user?.status === "pending"
                          ? "Under review"
                          : user?.status === "created"
                            ? "Unverified"
                            : "Verify"}
                  </Chip>
                </View>
              </View>
            </View>
          </View>

          {Platform.OS === 'ios' && (
            <Button
              mode="contained"
              icon="apple"
              onPress={handleLinkAppleAccount}
              style={styles.linkAppleButton}
            >
              Link Apple Account
            </Button>
          )}

          {/* <Button
            mode="contained"
            icon="apple"
            onPress={handleLinkAppleAccount}
            style={styles.linkAppleButton}
          >
            Link Apple Account
          </Button> */}


          <Divider style={styles.divider} />

          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                bottom: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("AboutMeScreen")}
              >
                <Text style={styles.cardTitle}>About Me</Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ bottom: 10, color: "red", height: 1 }} />
            <View style={styles.contentContainer}>
              <Text style={styles.cardDescription}>{user?.about_me}</Text>
            </View>
          </View>


          {isFetched && (
            <>
              <SkillsChip skills={user.skills} />
              <EducationItem educations={user.educations} />
              <SeminarsTrainings trainings={user.trainings} />
              <WorkExperience work_experiences={user.work_experiences} />
            </>
          )}
        </View>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {user?.status === "approved" && (
              <MaterialIcons
                name="verified"
                size={30}
                color={colors.primary}
                style={styles.icon}
              />
            )}
            {user?.status === "rejected" && (
              <MaterialIcons
                name="gpp-bad"
                size={30}
                color={colors.primary}
                style={styles.icon}
              />
            )}
            {user?.status === "pending" && (
              <MaterialIcons
                name="hourglass-top"
                size={30}
                color={colors.primary}
                style={styles.icon}
              />
            )}
            {user?.status === "created" && (
              <MaterialIcons
                name="shield"
                size={30}
                color={colors.primary}
                style={styles.icon}
              />
            )}
            <View style={styles.modalText}>
              {user?.status === "approved" && (
                <>
                  <Text
                    style={[
                      styles.modalText,
                      { fontSize: 20, fontWeight: "500" },
                    ]}
                  >
                    Your account has been successfully verified.
                  </Text>
                </>
              )}
              {user?.status === "rejected" && (
                <>
                  <Text
                    style={[
                      styles.modalText,
                      { fontSize: 20, fontWeight: "500" },
                    ]}
                  >
                    Your account verification was not approved.
                  </Text>
                  <Text style={[styles.modalText, { color: "gray" }]}>
                    Please try again or contact support for assistance.
                  </Text>
                </>
              )}
              {user?.status === "pending" && (
                <>
                  <Text
                    style={[
                      styles.modalText,
                      { fontSize: 20, fontWeight: "500" },
                    ]}
                  >
                    Your account is currently under review.
                  </Text>
                  <Text style={[styles.modalText, { color: "gray" }]}>
                    You will receive an update shortly.
                  </Text>
                </>
              )}
              {user?.status === "created" && (
                <>
                  <Text
                    style={[
                      styles.modalText,
                      { fontSize: 20, fontWeight: "500" },
                    ]}
                  >
                    Account Unverified
                  </Text>
                  <Text style={[styles.modalText, { color: "gray" }]}>
                    Please verify your account.
                  </Text>
                </>
              )}
              {["approved", "rejected", "pending", "created"].indexOf(
                user?.status
              ) === -1 && (
                  <>
                    <Text>Please verify your account to proceed.</Text>
                  </>
                )}
            </View>
          </View>
          <Divider />
          <Button
            mode="contained"
            onPress={handleButtonPress}
            style={styles.button}
          >
            <Text
              style={{
                lineHeight: 15,
              }}
            >
              {user?.status === "created" || user?.status === "rejected"
                ? "Okay"
                : "Close"}
            </Text>
          </Button>
        </Modal>
      </Portal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarType === "success" ? "green" : "red",
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  header: {
    backgroundColor: "#0A3480",
    paddingHorizontal: 20,
    justifyContent: "center",
    height: 150,
  },
  iconButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    marginTop: 20,
  },
  profileImageContainer: {
    flex: 1,
    backgroundColor: "#0A3480",
    borderRadius: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 10,
    top: 10,
  },
  userInfo: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 20,
  },
  buttonContent: {
    flexDirection: "row-reverse",
  },
  buttonLabel: {
    color: "white",
    fontSize: 14,
  },
  headerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerProfession: {
    color: "#DFDFDF",
    fontSize: 12,
  },
  headerText: { color: "#DFDFDF", fontSize: 12 },

  flexReverse: {
    flexDirection: "row",
    justifyContent: "center",
  },
  contentStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    padding: 8,
  },
  sectionContent: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  cardContent: {
    justifyContent: "center",
    flex: 1,
  },
  contentContainer: {},
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#0A3480",
  },
  cardDescription: {
    textAlign: "justify",
  },
  cardIcon: {
    marginRight: 10,
  },
  chip: {
    margin: 4,
    borderRadius: 20,
  },
  divider: {
    marginVertical: 8,
  },
  educationItem: {
    marginBottom: 10,
  },
  educationTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0A3480",
  },

  imageStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
  },
  modalContent: {
    alignItems: "center",
    padding: 20,
  },
  modalText: {
    textAlign: "center",
    justifyContent: "center",
  },
  button: {
    // borderRadius: 8,
    marginHorizontal: 50,
    marginVertical: 10,
    height: 35,
  },
  icon: {
    marginBottom: 10,
  },
  linkAppleButton: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: "#0A3480",
  },
});

export default Account;
