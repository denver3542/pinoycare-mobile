import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import Dashboard from "../screens/Dashboard";
import Account from "../screens/User/Account";
import Jobs from "../screens/User/Jobs/Jobs";
import Feeds from "../screens/User/Feeds/Feeds";
import Applications from "../screens/Applications/Applications";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "../hooks/useUser";
import { Image } from "react-native";

import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../utils/pushNotificationConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationState } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const tabScreens = [
  { name: "Feeds", component: Feeds, iconName: "list" },
  { name: "Find Jobs", component: Jobs, iconName: "search" },
  { name: "Dashboard", component: Dashboard, iconName: "dashboard" },
  { name: "Application", component: Applications, iconName: "assignment" },
  { name: "Account", component: Account, iconName: "account-circle" },
];

async function setUserToken(token) {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const { data } = await axiosInstance.put("/auth/push-token", token, {
      headers,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function CustomBottomTabs() {
  const { user, isFetched } = useUser();
  const navigation = useNavigation();
  const [isMessagingScreen, setIsMessagingScreen] = useState(false);

  // Track current screen
  const routeName = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    if (routeName === "MessageList") {
      setIsMessagingScreen(true);
    } else {
      setIsMessagingScreen(false);
    }
  }, [routeName]);

  const queryClient = useQueryClient();

  const setUserPushToken = useMutation((token) => setUserToken(token), {
    onMutate: (vars) => {
      const updatedUser = {
        ...user,
        push_token: vars.pushToken,
      };
      queryClient.setQueryData(["user"], updatedUser);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setUserPushToken.mutate({ pushToken: token });
    });

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Disable notification alert if this case is true
        if (isMessagingScreen) {
          Notifications.dismissNotificationAsync(
            notification.request.identifier
          );
        }
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data && data.screen) {
          navigation.navigate(data.screen);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
    };
  }, [isMessagingScreen]);

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
              screen.name === "Account" &&
              user &&
              user.media &&
              user.media[0] &&
              user.media[0].original_url ? (
                <Image
                  source={{ uri: user.media[0].original_url }}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 0.5,
                    borderColor: "gray",
                  }}
                />
              ) : (
                <MaterialIcons
                  name={screen.iconName}
                  color={color}
                  size={size}
                />
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
