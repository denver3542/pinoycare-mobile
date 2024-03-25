import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Dashboard from "../screens/Dashboard";
import Account from "../screens/User/Account";
import Jobs from "../screens/User/Jobs/Jobs";
import Feeds from "../screens/User/Feeds/Feeds";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Applications from "../screens/Applications/Applications";
import Candidates from "../screens/Employer/Candidates";
import AppliedCandidatesScreen from "../screens/Employer/Candidates";
import PostedJobsScreen from "../screens/Employer/Jobs";

const Tab = createBottomTabNavigator();

const tabScreens = [
  {
    name: "Home",
    component: Feeds,
    iconName: "home-circle",
    iconNameOutlined: "home-circle-outline",
  },
  {
    name: "Feeds",
    component: Jobs,
    iconName: "newspaper-variant",
    iconNameOutlined: "newspaper-variant-outline",
  },
  {
    name: "Jobs",
    component: PostedJobsScreen,
    iconName: "plus-circle",
    iconNameOutlined: "plus-circle-outline",
  },
  {
    name: "Candidates",
    component: AppliedCandidatesScreen,
    iconName: "briefcase-account",
    iconNameOutlined: "briefcase-account-outline",
  },
  {
    name: "Account",
    component: Account,
    iconName: "account-circle",
    iconNameOutlined: "account-circle-outline",
  },
];

function EmployerCustomBottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ animationEnabled: false, headerShown: false }}
      initialRouteName="Jobs"
    >
      {tabScreens.map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? screen.iconNameOutlined : screen.iconName}
                size={focused ? 40 : size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default EmployerCustomBottomTabs;
