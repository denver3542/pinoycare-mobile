import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";

import Home from "../screens/Home";
import SignUp from "../screens/Auth/SignUp";
import Login from "../screens/Auth/Login";
import Professional from "../screens/Auth/Registration/Professional";
import IndividualEmployer from "../screens/Auth/Registration/IndividualEmployer";
import OrganizationEmployer from "../screens/Auth/Registration/OrganizationEmployer";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import { useUser } from "../hooks/useUser";
import Spinner from "react-native-loading-spinner-overlay";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import index from "../screens/User";
import { FontAwesome5 } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
function LandingNavigation() {
  const { user, isFetching, isFetched } = useUser();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (isFetched) {
      setLoading(false);
    }
  }, [isFetched]);

  return (
    <NavigationContainer>
      {loading && <Spinner visible={loading} />}
      {!user && !isFetching ? (
        <Stack.Navigator>
          <Stack.Group
            screenOptions={{ animationEnabled: false, headerShown: false }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Professional" component={Professional} />
            <Stack.Screen name="IndividualEmployer" component={IndividualEmployer} />
            <Stack.Screen name="OrganizationEmployer" component={OrganizationEmployer} />
            <Stack.Screen name="UserHome" component={AuthenticatedNavigation} />
          </Stack.Group>
        </Stack.Navigator>
      ) : (
        <BottomTab.Navigator initialRouteName='Home'
          screenOptions={{ animationEnabled: false, headerShown: false }}
        >

          <BottomTab.Screen name="Home" component={index}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'home'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            }}
          />
          <BottomTab.Screen name="Feeds" component={index}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'file-alt'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            }}
          />
          <BottomTab.Screen name="Jobs" component={index}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'briefcase'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            }}
          />
          <BottomTab.Screen name="Application" component={index}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'user-cog'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            }}
          />
          <BottomTab.Screen name="Account" component={index}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'sliders-h'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            }}
          />
        </BottomTab.Navigator>
      )}

    </NavigationContainer >
  );
}

export default LandingNavigation;
