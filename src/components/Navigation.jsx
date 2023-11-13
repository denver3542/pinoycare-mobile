import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import Home from "../screens/Home";

const Stack = createNativeStackNavigator();
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Group
          screenOptions={{ animationEnabled: false, headerShown: false }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
