import React, { useState, useEffect } from "react";
import { Chip, Divider, IconButton, Snackbar, Button, Card, Appbar } from "react-native-paper";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
          <Image source={require("../../../assets/pinoycare.png")} style={styles.imageStyle} />
          <Appbar.Content title="Account" titleStyle={{ color: 'white' }} />
          <Appbar.Action icon={() => <MaterialIcons name="settings" size={24} color="white" />} onPress={() => navigation.navigate("SettingsScreen")} />
        </Appbar.Header>

        <View style={styles.contentStyle}>

          <View style={styles.userInfo}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  user && user.media[0]
                    ? { uri: user.media[0].original_url } : require("../../../assets/images/sample-profile.jpg")}
                style={styles.profileImage}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                  <Text style={styles.headerName}>{user?.name || ""}</Text>
                  <IconButton
                    icon={() => <MaterialIcons name="border-color" size={14} color="white" />}
                    size={20}
                    selected
                    onPress={() => navigation.navigate("EditUserProfileScreen")}
                  />
                </View>
                <View style={{ marginBottom: 5 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <MaterialIcons name="work" size={14} color="white" style={{ marginRight: 5 }} />
                    <Text style={styles.headerProfession}>{user?.profession || "No Profession"}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 0 }}>
                    <MaterialIcons name="location-on" size={14} color="white" style={{ marginRight: 5 }} />
                    <Text style={styles.headerText}>{user?.permanent_address || ""} </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 0, alignItems: 'center' }}>
                    <MaterialIcons name="email" size={14} color="white" style={{ marginRight: 5 }} />
                    <Text style={styles.headerText}>{user?.email || ""} </Text>
                  </View>
                </View>
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

                <View style={{
                  flexWrap: 'wrap',
                  marginTop: 2
                }}>
                  <Chip
                    onPress={() => {
                      if (user?.verified?.status !== 'verified' && user?.verified?.status !== 'to be reviewed') {
                        navigation.navigate("WalkThroughVerificationScreen");
                      }
                    }}
                    icon={({ size, color }) => (
                      user?.verified?.status === 'to be reviewed' ? (
                        <MaterialIcons name="hourglass-top" size={12} color={color} />
                      ) : (
                        user?.verified?.status === 'verified' ? (
                          <MaterialIcons name="verified-user" size={12} color={color} />
                        ) : (
                          <MaterialIcons name="shield" size={12} color={color} />
                        )
                      )
                    )}
                    compact
                    style={{ backgroundColor: 'white', borderRadius: 8 }}
                    textStyle={{
                      color: 'black', fontSize: 10, fontWeight: 'bold',
                      minHeight: 10,
                      lineHeight: 12,
                      alignItems: "center",
                      marginVertical: 2
                    }}
                  >
                    {user?.verified?.status === 'verified' ? 'Verified' :
                      user?.verified?.status === 'failed' ? 'Verify' :
                        user?.verified?.status === 'to be reviewed' ? 'Under review' : user?.verified?.status || "Verify"}
                  </Chip>
                </View>



              </View>
            </View>

          </View>

          <Divider style={styles.divider} />

          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", bottom: 10 }}>
              <Text style={styles.cardTitle}>About Me</Text>

              <IconButton
                icon={() => <MaterialIcons name="border-color" size={14} color="#0A3480" />}
                size={20}
                selected
                onPress={() => navigation.navigate("AboutMeScreen")}
              />
            </View>
            <Divider style={{ bottom: 10, color: 'red', height: 1, }} />
            {/* <Divider style={styles.divider} /> */}
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
    </AuthenticatedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#0A3480",
    paddingHorizontal: 20,
    justifyContent: "center",
    height: 150,
  },
  iconButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 20
  },
  // userInfoContainer: {
  //   flexDirection: "row",
  //   alignItems: 'flex-start',
  //   justifyContent: 'space-between'
  // },
  profileImageContainer: {
    flex: 1,
    backgroundColor: "#0A3480",
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
    top: 10
  },
  // userInfo: {
  //   flex: 1,
  //   marginLeft: 5,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-start',
  // },
  userInfo: {
    flex: 1
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
    color: "#DFDFDF", fontSize: 12
  },
  headerText: { color: "#DFDFDF", fontSize: 12 },
  button: {
    marginLeft: 10,
    padding: 0,
  },
  flexReverse: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentStyle: {
    backgroundColor: "#F4F7FB",
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
    elevation: 0.5,
  },
  cardContent: {
    justifyContent: 'center',
    flex: 1
  },
  contentContainer: {},
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  educationDescription: {
    fontSize: 16,
    color: "#556789",
  },
  cardDescription: {
    textAlign: 'justify'
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
    marginVertical: 15,
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
  imageStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Account;
