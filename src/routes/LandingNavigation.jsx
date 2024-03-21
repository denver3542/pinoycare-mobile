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
import AboutMeScreen from "../screens/User/About/AboutMeForm";
import AddSkillScreen from "../screens/User/Profile/AddSkillScreen";
import AddEducationScreen from "../screens/User/Profile/AddEducationScreen";
import SettingsScreen from "../screens/User/Profile/SettingsScreen";
import CustomBottomTabs from "../components/CustomBottomTabs";
import Job from "../screens/Jobs/Job";

// Import hooks
import { useUser } from "../hooks/useUser";
import EmployerCustomBottomTabs from "../components/EmployerCustomBottomTabs";
import CandidateDetailsScreen from "../screens/Employer/Candidates/CandidateDetailsScreen";
import JobDetailsScreen from "../screens/Employer/Jobs/JobDetailsScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPassword";
import MessageList from "../screens/Messaging/MessageList";
import ChatConversation from "../screens/Messaging/ChatConversation";

const Stack = createNativeStackNavigator();

function LandingNavigation() {
  const { user, isFetched, isFetching } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFetched) {
      setLoading(false);
    }
  }, [isFetched]);

  return (
    <NavigationContainer>
      {loading ? (
        <Spinner visible={loading} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
              />
              <Stack.Screen name="Professional" component={Professional} />
              <Stack.Screen
                name="IndividualEmployer"
                component={IndividualEmployer}
              />
              <Stack.Screen
                name="OrganizationEmployer"
                component={OrganizationEmployer}
              />
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
              <Stack.Screen
                name="ChatConversation"
                component={ChatConversation}
              />
              <Stack.Screen
                name="EditEducationScreen"
                component={EditEducationScreen}
              />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default LandingNavigation;
