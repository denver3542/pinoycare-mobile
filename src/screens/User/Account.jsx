import React, { useState, useEffect } from "react";
import { Chip, Divider, IconButton, Snackbar, Button, Card } from "react-native-paper";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AuthenticatedLayout from "../../Layout/User/Unauthorize/AuthenticatedLayout";
import SkillsChip from "./Profile/Skills/SkillsCardList";
import SeminarsTrainings from "./Profile/SeminarsAndTrainings/SeminarsTrainingsCardList";
import EducationItem from "./Profile/Education/EducationCardList";
import EditEducation from "./Profile/Education/EditEducations";
import WorkExperience from "./Profile/WorkExperience/WorkExperienceCardList";
import { useUser } from "../../hooks/useUser";
import useSkills from "./Profile/Skills/hooks/useSkills";
import useAuth from "../../hooks/useAuth";

const Account = ({ activeNav }) => {
  const navigation = useNavigation();
  const { user, isFetched, isLoading } = useUser();
  const { logout } = useAuth();
  const [snackbarProperties, setSnackbarProperties] = useState({
    visible: false,
    text: "",
  });


  if (isLoading) {
    return <Spinner visible={true} textContent={'Loading...'} />;
  }

  if (!isFetched) {
    return <Text>Error fetching user data.</Text>;
  }


  return (
    <AuthenticatedLayout activeBottomNav={activeNav?.route?.name}>
      {isLoading ? (
        <Spinner
          visible={true}
          textContent={'Loading...'}
        />
      ) : isFetched ? (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.iconButtonContainer}>
                <IconButton
                  icon={() => <MaterialIcons name="settings" size={20} color="white" />}
                  size={25}
                  selected
                  onPress={() => navigation.navigate("SettingsScreen")}
                />
              </View>

              <View style={styles.userInfoContainer}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={
                      user && user.media[0]
                        ? { uri: user.media[0].original_url }
                        : require("../../../assets/images/sample-profile.jpg")
                    }
                    style={styles.profileImage}
                  />

                  <View style={styles.userInfo}>
                    <Text style={styles.headerName}>{user?.name || ""}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.headerProfession}>{user?.profession || "No Profession"}</Text>
                      <Text style={{ color: 'white', marginHorizontal: 5 }}>|</Text>
                      {/* <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                          if (user?.status !== 'approved') {
                            navigation.navigate("WalkThroughVerificationScreen");
                          }
                        }}
                      >
                        <MaterialIcons name="check-circle-outline" size={14} color="white" style={{ marginRight: 3 }} />
                        <Text style={{ color: 'white' }}>
                          {user?.status === 'approved' ? 'Verified' :
                            user?.status === 'pending' ? 'Verify Now' :
                              user?.status === 'created' ? 'Verify Now' :
                                user?.status === 'rejected' ? 'Rejected' : user?.status || ""}
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                          if (user?.status !== 'approved' && user?.status !== 'pending') {
                            navigation.navigate("WalkThroughVerificationScreen");
                          }
                        }}
                      >
                        <MaterialIcons name="check-circle-outline" size={14} color="white" style={{ marginRight: 3 }} />
                        <Text style={{ color: 'white' }}>
                          {user?.status === 'approved' ? 'Verified' :
                            user?.status === 'pending' ? 'Pending' :
                              user?.status === 'created' ? 'Verify Now' :
                                user?.status === 'rejected' ? 'Rejected' : user?.status || ""}
                        </Text>
                      </TouchableOpacity>


                    </View>

                  </View>

                </View>

                <View>
                  <Button
                    icon="pencil"
                    onPress={() => navigation.navigate("EditUserProfileScreen")}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    Edit
                  </Button>
                </View>
              </View>

            </View>

          </View>

          <View style={styles.contentStyle}>
            <View style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={styles.sectionContent}>
                  <FontAwesome5
                    name="user-circle"
                    size={20}
                    color="#0A3480"
                    style={styles.cardIcon}
                    solid
                  />
                  <Text style={styles.cardTitle}>About Me</Text>
                </View>
                <IconButton
                  icon={() => <MaterialIcons name="edit" size={20} color="#0A3480" />}
                  size={20}
                  selected
                  onPress={() => navigation.navigate("AboutMeScreen")}
                />
              </View>
              <Divider
                style={styles.divider}
              />
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
          <Snackbar
            visible={snackbarProperties.visible}
            onDismiss={() => setSnackbarProperties({ visible: false, text: "" })}
            duration={Snackbar.DURATION_SHORT}
          >
            {snackbarProperties.text}
          </Snackbar>
        </View>
      ) : (
        <View>
          <Text>Error fetching user data.</Text>
        </View>
      )}
    </AuthenticatedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  chip: {
    margin: 4,
  },
  header: {
    // flexDirection: "row",
    backgroundColor: "#0A3480",
    paddingHorizontal: 20,
    justifyContent: "center",
    height: 150,
    // position: 'relative',
  },

  iconButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 20
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },

  profileImageContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 10,
  },

  userInfo: {
    marginLeft: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20
  },

  buttonContent: {
    flexDirection: 'row-reverse',
  },

  buttonLabel: {
    color: 'white',
    fontSize: 14,
  },
  headerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerProfession: {
    color: "white",
  },

  button: {
    marginLeft: 10,
    padding: 0, // Smaller padding for the button
  },
  flexReverse: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentStyle: {
    // paddingHorizontal: 10,
    // paddingVertical: 30,
    backgroundColor: "#F4F7FB",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  sectionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    elevation: 1,
  },

  cardContent: {
    justifyContent: 'center',
    flex: 1
  },

  contentContainer: { margin: 10 },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0A3480'
  },

  educationDescription: {
    fontSize: 16,
    marginBottom: 3,
    color: "#555",
  },

  educationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  educationItem: {
    padding: 20
  },
  cardIcon: {
    marginRight: 10,
  },
  chip: {
    margin: 4,
    borderRadius: 20,
  },
  divider: {
    height: 0.5,
    marginBottom: 10,
  },
  educationItem: {
    marginBottom: 10,
  },
  educationTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#0A3480",
  },
  educationDescription: {
    marginBottom: 5,
  },

  button: {
    padding: 0,
    width: 100,
  },

});

export default Account;
