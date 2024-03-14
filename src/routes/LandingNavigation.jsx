import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

// Import screens
import Home from "../screens/Home";
import SignUp from "../screens/Auth/SignUp";
import Login from "../screens/Auth/Login";
import Professional from "../screens/Auth/Registration/Professional";
import IndividualEmployer from "../screens/Auth/Registration/IndividualEmployer";
import OrganizationEmployer from "../screens/Auth/Registration/OrganizationEmployer";
import EditUserProfileScreen from "../screens/User/Profile/EditUserProfileScreen";
import VerificationScreen from '../screens/User/Profile/VerificationScreen';
import AboutMeScreen from '../screens/User/Profile/AboutMeScreen';
import AddSkillScreen from '../screens/User/Profile/AddSkillScreen';
import Feeds from "../screens/User/Feeds";
import Jobs from "../screens/User/Jobs";
import Application from "../screens/User/Application";
import Account from "../screens/User/Account";
import Dashboard from "../screens/User/Dashboard";

// Import hooks
import { useUser } from "../hooks/useUser";

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
  const { user, isFetched } = useUser();
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
          <Stack.Group screenOptions={{ animationEnabled: false, headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Professional" component={Professional} />
            <Stack.Screen name="IndividualEmployer" component={IndividualEmployer} />
            <Stack.Screen name="OrganizationEmployer" component={OrganizationEmployer} />
          </Stack.Group>
        </Stack.Navigator>
      ) : (
        <BottomTab.Navigator screenOptions={{ animationEnabled: false }}>
          <BottomTab.Screen
            name="Dashboard"
            initialParams={{ activeRouteName: activeRouteName, userData: user }}
            component={Dashboard}
            options={({ route }) => ({
              headerShown: false,
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'home'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            })}
          />
          <BottomTab.Screen name="Feeds" initialParams={activeRouteName} component={Feeds}
            options={({ route }) => ({
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'file-alt'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            })}
          />
          <BottomTab.Screen name="Jobs" initialParams={activeRouteName} component={Jobs}
            options={({ route }) => ({
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'briefcase'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            })}
          />
          <BottomTab.Screen name="Application" initialParams={activeRouteName} component={Application}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'user-cog'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            }}
          />
          <BottomTab.Screen name="Account" initialParams={activeRouteName} component={AccountNavigator}
            options={({ route }) => ({
              headerShown: false,
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name={'sliders-h'} color={color} size={20} style={{ marginTop: 5 }} />
              ),
            })}
          />
        </BottomTab.Navigator>
      )}
    </NavigationContainer>
  );
}

const AccountNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AccountScreen" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="EditUserProfileScreen" component={EditUserProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AboutMeScreen" component={AboutMeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddSkillScreen" component={AddSkillScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#001C4E",
    height: 200,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
    marginTop: 60
  },
  headerSubtitle: {
    color: "#C3C3C3",
    fontSize: 18,
    fontWeight: "normal",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    top: 50,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#002884",
    borderRadius: 20,
    padding: 10,
  },
});

export default LandingNavigation;
