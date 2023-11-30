import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import Home from "../screens/Home";
import SignUp from "../screens/Auth/SignUp";
import Login from "../screens/Auth/Login";
import Professional from "../screens/Auth/Registration/Professional";
import IndividualEmployer from "../screens/Auth/Registration/IndividualEmployer";
import OrganizationEmployer from "../screens/Auth/Registration/OrganizationEmployer";
import AuthenticatedLayout from "../Layout/User/Unauthorize/AuthenticatedLayout";

const Stack = createNativeStackNavigator();
function LandingNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Group
          screenOptions={{ animationEnabled: false, headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Professional" component={Professional} />
          <Stack.Screen name="IndividualEmployer" component={IndividualEmployer} />
          <Stack.Screen name="OrganizationEmployer" component={OrganizationEmployer} />
          <Stack.Screen name="UserHome" component={AuthenticatedLayout} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer >
  );
}

export default LandingNavigation;
