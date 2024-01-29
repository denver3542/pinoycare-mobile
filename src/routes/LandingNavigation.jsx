import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Home from "../screens/Home";
import SignUp from "../screens/Auth/SignUp";
import Login from "../screens/Auth/Login";
import Professional from "../screens/Auth/Registration/Professional";
import IndividualEmployer from "../screens/Auth/Registration/IndividualEmployer";
import OrganizationEmployer from "../screens/Auth/Registration/OrganizationEmployer";
import { useUser } from "../hooks/useUser";
import Spinner from "react-native-loading-spinner-overlay";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import Feeds from "../screens/User/Feeds";
import Jobs from "../screens/User/Jobs";
import Application from "../screens/User/Application";
import Account from "../screens/User/Account";
import Dashboard from "../screens/User/Dashboard";
import { Text } from "react-native-paper";
import HeaderAvatar from "../components/HeaderAvatar";
import HeaderSettings from "../components/HeaderSettings";
import HeaderNotification from "../components/HeaderNotification";


const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function getActiveRouteName(state) {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
}

function LandingNavigation() {
  const { user, isFetching, isFetched } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeRouteName, setActiveRouteName] = useState('');

  useLayoutEffect(() => {
    if (isFetched) {
      setLoading(false);
    }
  }, [isFetched]);

  const handleStateChange = (state) => {
    const route = getActiveRouteName(state);
    setActiveRouteName(route);
  };



  return (
    <NavigationContainer onStateChange={handleStateChange}>
      {loading && <Spinner visible={loading} />}
      {!user ? (
        <Stack.Navigator>
          <Stack.Group
            screenOptions={{ animationEnabled: false, headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Professional" component={Professional} />
            <Stack.Screen name="IndividualEmployer" component={IndividualEmployer} />
            <Stack.Screen name="OrganizationEmployer" component={OrganizationEmployer} />
          </Stack.Group>
        </Stack.Navigator>
      ) : (
        <BottomTab.Navigator
          screenOptions={{ animationEnabled: false }}
        >

          <BottomTab.Screen name="Dashboard" initialParams={activeRouteName} component={Dashboard}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'home'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
              headerStyle: {
                backgroundColor: '#001C4E',
                // color: '#fff',
                shadowOpacity: 0,
                elevation: 0,
                height: 150,
              },
              headerLeft: () => (
                <HeaderSettings subtitle={'Hello'} title={'Michael Caligner'} />
              ),
              headerTitle: '',
              headerRight: () => (
                <HeaderNotification />
              ),
              // headerShown: false 
            }}
            
          />
          <BottomTab.Screen name="Feeds" initialParams={activeRouteName} component={Feeds}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'file-alt'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
              headerStyle: {
                backgroundColor: '#001C4E',
               
                shadowOpacity: 0,
                elevation: 0,
              },
              headerTitle: 'Your feed',
              headerTitleStyle: {
                color: 'white'
              },
              headerTitleAlign: 'center',
              headerRight: () => (
                <HeaderSettings />
              ),
            }}
          />
          <BottomTab.Screen name="Jobs" initialParams={activeRouteName} component={Jobs}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'briefcase'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
              headerStyle: {
                backgroundColor: '#001C4E',
               
                shadowOpacity: 0,
                elevation: 0,
              },
              headerTitle: 'Find Jobs',
              headerTitleStyle: {
                color: 'white'
              },
              headerTitleAlign: 'center',
              headerRight: () => (
                <HeaderSettings />
              ),
            }}
          />
          <BottomTab.Screen name="Application" initialParams={activeRouteName} component={Application}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'user-cog'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
              headerStyle: {
                backgroundColor: '#001C4E',
               
                shadowOpacity: 0,
                elevation: 0,
              },
              headerTitle: 'Applications',
              headerTitleStyle: {
                color: 'white'
              },
              headerTitleAlign: 'center',
              headerRight: () => (
                <HeaderSettings />
              ),
            }}
          />
          <BottomTab.Screen name="Account" initialParams={activeRouteName} component={Account}
            options={{
              tabBarLabel: '', // Hides the label
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'sliders-h'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
              headerStyle: {
                backgroundColor: '#001C4E',
               
                shadowOpacity: 0,
                elevation: 0,
              },
              headerTitle: 'Account Settings',
              headerTitleStyle: {
                color: 'white'
              },
              headerTitleAlign: 'center',
              headerRight: () => (
                <HeaderSettings />
              ),
            }}
          />
        </BottomTab.Navigator>
      )}

    </NavigationContainer>
  );
}

export default LandingNavigation;
