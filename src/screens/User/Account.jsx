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
import { FontAwesome5 } from "@expo/vector-icons";
import AuthenticatedLayout from "../../Layout/User/Unauthorize/AuthenticatedLayout";
import SeminarsTrainings from "./Profile/SeminarsAndTrainings/SeminarsTrainingsCardList";
import EducationItem from "./Profile/Education/EducationCardList";
import WorkExperience from "./Profile/WorkExperience/WorkExperienceCardList";
import { useUser } from "../../hooks/useUser";
import useAuth from "../../hooks/useAuth";

const SkillsChip = ({ skill, setSnackbarProperties }) => {
  return (
    <Chip
      compact
      mode="outlined"
      onPress={() => { }}
      onClose={() =>
        setSnackbarProperties({
          visible: true,
          text: "Skill Removed",
        })
      }
      style={styles.chip}
    >
      <Text style={{ fontSize: 10 }}>{skill.skill_name}</Text>
    </Chip>
  );
};

const Account = ({ activeNav }) => {
  const navigation = useNavigation();
  const { user, isFetching, isFetched } = useUser();
  const { logout } = useAuth();
  const [snackbarProperties, setSnackbarProperties] = useState({
    visible: false,
    text: "",
  });

  return (
    <AuthenticatedLayout activeBottomNav={activeNav?.route?.name}>
      {isFetching ? (
        <Spinner visible={loading} />
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.userInfoContainer}>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={
                      user && user.media[0]
                        ? { uri: user.media[0].original_url }
                        : require("../../../assets/images/sample-profile.jpg")
                    }
                    style={styles.profileImage}
                  />
                </View>

                <View>
                  <Text style={styles.headerName}>{user?.name || ""}</Text>
                  <Text style={styles.headerProfession}>{user?.profession || ""}</Text>
                </View>

                <View style={{ marginLeft: 10 }}>
                  <Button
                    icon="pencil"
                    onPress={() => { }}
                    style={[styles.button]}
                    contentStyle={styles.flexReverse}
                    labelStyle={{ color: 'white', fontSize: 14 }}
                  >
                    Edit
                  </Button>
                  <Button
                    onPress={logout}
                    icon="logout"
                    style={[styles.button]}
                    contentStyle={styles.flexReverse}
                    labelStyle={{ color: 'white', fontSize: 14 }}
                  >
                    Logout
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
                  icon="pencil-box"
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



            <View style={styles.sectionContainer}>
              {user?.educations && user.educations.length > 0 ? (
                <EducationItem educations={user.educations} />
              ) : (
                <Text>No education found</Text>
              )}
            </View>

            <View style={styles.sectionContainer}>
              {user?.trainings && user.trainings.length > 0 ? (
                <SeminarsTrainings trainings={user.trainings} />
              ) : (
                <Text>No Trainings found</Text>
              )}
            </View>


            <View style={styles.sectionContainer}>
              {user?.work_experiences && user.work_experiences.length > 0 ? (
                <WorkExperience work_experiences={user.work_experiences} />
              ) : (
                <Text>No Work Experience found</Text>
              )}
            </View>
          </View>

          <Snackbar
            visible={snackbarProperties.visible}
            onDismiss={() => setSnackbarProperties({ visible: false, text: "" })}
            duration={Snackbar.DURATION_SHORT}
          >
            {snackbarProperties.text}
          </Snackbar>
        </View>
      )}
    </AuthenticatedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  sectionContainer: {
    marginBottom: 20
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#0A3480",
    paddingVertical: 30,
    paddingHorizontal: 15,
    height: 200,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerName: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  headerProfession: {
    color: "white",
    fontSize: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginRight: 20,
  },
  button: {
    marginLeft: 10
  },
  flexReverse: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
  },
  contentStyle: {
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    marginVertical: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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

});

export default Account;
