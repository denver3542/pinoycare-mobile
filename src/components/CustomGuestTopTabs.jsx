import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import GuestFeeds from "../screens/Guest/Feeds";
import GuestJobs from "../screens/Guest/Jobs";

const Tab = createMaterialTopTabNavigator();

const tabScreens = [
  { name: "Feeds", component: GuestFeeds, iconName: "list" },
  { name: "Find Jobs", component: GuestJobs, iconName: "search" },
];
function CustomGuestTopTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ animationEnabled: false, headerShown: false }}
      initialRouteName="Feeds"
    >
      {tabScreens.map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={
            {
              // tabBarIcon: ({ color, size }) => (
              //   <MaterialIcons name={screen.iconName} color={color} size={size} />
              // ),
            }
          }
        />
      ))}
    </Tab.Navigator>
  );
}

export default CustomGuestTopTabs;
