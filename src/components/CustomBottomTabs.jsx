import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Dashboard from "../screens/Dashboard";
import Account from "../screens/User/Account";
import Jobs from "../screens/User/Jobs/Jobs";
import Feeds from "../screens/User/Feeds/Feeds";
import Applications from "../screens/Applications/Applications";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "../hooks/useUser";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

const tabScreens = [
  { name: "Feeds", component: Feeds, iconName: "list" },
  { name: "Find Jobs", component: Jobs, iconName: "search" },
  { name: "Dashboard", component: Dashboard, iconName: "dashboard" },
  { name: "Application", component: Applications, iconName: "assignment" },
  { name: "Account", component: Account, iconName: "account-circle" },
];

function CustomBottomTabs() {
  const { user } = useUser();
  return (
    <Tab.Navigator
      screenOptions={{ animationEnabled: true, headerShown: false }}
      initialRouteName="Dashboard"
    >
      {tabScreens.map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarIcon: ({ color, size }) =>
              screen.name === "Account" && user && user.media && user.media[0] && user.media[0].original_url ? (
                <Image
                  source={{ uri: user.media[0].original_url }}
                  style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 0.5, borderColor: 'gray' }}
                />
              ) : (
                <MaterialIcons name={screen.iconName} color={color} size={size} />
              ),
            ...(screen.headerSearchBarOptions && {
              headerSearchBarOptions: screen.headerSearchBarOptions,
            }),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default CustomBottomTabs;
