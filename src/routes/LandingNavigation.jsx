import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";

// Import screens
import Home from "../screens/Home";
import SignUp from "../screens/Auth/SignUp";
import Login from "../screens/Auth/Login";
import Professional from "../screens/Auth/Registration/Professional";
import IndividualEmployer from "../screens/Auth/Registration/IndividualEmployer";
import OrganizationEmployer from "../screens/Auth/Registration/OrganizationEmployer";
import EditUserProfileScreen from "../screens/User/Profile/EditUserProfileScreen";
import AboutMeScreen from "../screens/User/About/AboutMeForm";
import AddSkillScreen from "../screens/User/Profile/AddSkillScreen";
import EditEducation from "../screens/User/Profile/Education/EditEducations";
import UpdateEducation from "../screens/User/Profile/Education/UpdateEducation";
import AddEducationScreen from "../screens/User/Profile/AddEducationScreen";
import SeminarsAndTrainingsEdit from "../screens/User/Profile/SeminarsAndTrainings/SeminarsAndTrainingsEdit";
import SeminarsAndTrainingsUpdate from "../screens/User/Profile/SeminarsAndTrainings/SeminarsAndTrainingsUpdate";
import AddSeminarsAndTrainings from "../screens/User/Profile/SeminarsAndTrainings/AddSeminarsAndTrainings";
import AddWorkExperience from "../screens/User/Profile/WorkExperience/AddWorkExperience";
import EditWorkExperience from "../screens/User/Profile/WorkExperience/EditWorkExperience";
import UpdateWorkExperience from "../screens/User/Profile/WorkExperience/UpdateWorkExperience";
import SettingsScreen from "../screens/User/Profile/SettingsScreen";
import WalkThroughVerificationScreen from "../screens/User/Profile/Verify/WalkTroughVerificationScreen";
import VerificationScreen from "../screens/User/Profile/Verify/VerificationScreen";
import CustomBottomTabs from "../components/CustomBottomTabs";
import Job from "../screens/Jobs/Job";

// Import hooks
import { useUser } from "../hooks/useUser";
import ForgotPasswordScreen from "../screens/Auth/ForgotPassword";
import MessageList from "../screens/Messaging/MessageList";
import ChatConversation from "../screens/Messaging/ChatConversation";
import NotificationsList from "../screens/Notifications/NotificationsList";
import JobApplicationQuestionnaire from "../screens/Jobs/JobApplicationQuestionnaire ";
import GuestFeeds from "../screens/Guest/Feeds";
import CustomGuestTopTabs from "../components/CustomGuestTopTabs";
import Index from "../screens/Guest";

const Stack = createNativeStackNavigator();

function LandingNavigation() {
  const { user, isFetched, isFetching } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFetched) {
      setLoading(false);
    }
  }, [isFetched]);

  const screenOptions = {
    headerShown: false,
    animation: "slide_from_right",
    animationTiming: 150,
  };

  return (
    <NavigationContainer>
      {loading ? (
        <Spinner visible={loading} />
      ) : (
        <Stack.Navigator screenOptions={screenOptions}>
          {!user ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="GuestTabs" component={Index} options={{ animation: 'fade', animationTiming: 3000, }} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Feeds" component={GuestFeeds} />
              <Stack.Screen name="Job" component={Job} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Professional" component={Professional} />
              <Stack.Screen name="IndividualEmployer" component={IndividualEmployer} />
              <Stack.Screen name="OrganizationEmployer" component={OrganizationEmployer} />
            </>
          ) : user.role === "admin" ? (
            <></>
          ) : user.role === "employer" ? (
            <>
              {/* <Stack.Screen
                name="BottomTabs"
                component={EmployerCustomBottomTabs}
              />
              <Stack.Screen
                name="CandidateDetails"
                component={CandidateDetailsScreen}
              />
              <Stack.Screen name="JobDetails" component={JobDetailsScreen} /> */}
            </>
          ) : (
            <>
              <Stack.Screen name="BottomTabs" component={CustomBottomTabs} />
              <Stack.Screen name="Job" component={Job} />
              <Stack.Screen name="AboutMeScreen" component={AboutMeScreen} />
              <Stack.Screen name="AddSkillScreen" component={AddSkillScreen} />
              <Stack.Screen name="MessageList" component={MessageList} />
              <Stack.Screen name="ChatConversation" component={ChatConversation} />
              <Stack.Screen name="AddEducationScreen" component={AddEducationScreen} />
              <Stack.Screen name="EditEducation" component={EditEducation} />
              <Stack.Screen name="UpdateEducation" component={UpdateEducation} />
              <Stack.Screen name="EditUserProfileScreen" component={EditUserProfileScreen} />
              <Stack.Screen name="AddSeminarsAndTrainings" component={AddSeminarsAndTrainings} />
              <Stack.Screen name="SeminarsAndTrainingsEdit" component={SeminarsAndTrainingsEdit} />
              <Stack.Screen name="SeminarsAndTrainingsUpdate" component={SeminarsAndTrainingsUpdate} />
              <Stack.Screen name="AddWorkExperience" component={AddWorkExperience} />
              <Stack.Screen name="EditWorkExperience" component={EditWorkExperience} />
              <Stack.Screen name="UpdateWorkExperience" component={UpdateWorkExperience} />
              <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
              <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
              <Stack.Screen name="WalkThroughVerificationScreen" component={WalkThroughVerificationScreen} />
              <Stack.Screen name="NotificationsList" component={NotificationsList} />
              <Stack.Screen name="Questionnaire" component={JobApplicationQuestionnaire} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default LandingNavigation;
