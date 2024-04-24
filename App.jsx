import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { ThemeProvider, createTheme } from "@rneui/themed";
import {
  PaperProvider,
  MD3LightTheme as paperDefaultTheme,
  configureFonts,
} from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Navigation from "./src/routes/LandingNavigation";
import LandingNavigation from "./src/routes/LandingNavigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import { enGB, registerTranslation } from "react-native-paper-dates";
import * as SplashScreen from "expo-splash-screen";
import 'react-native-gesture-handler';
import "expo-dev-client";
import { useEffect } from "react";
import { UserApplicationsProvider } from "./src/components/useUserApplications";
SplashScreen.preventAutoHideAsync();

registerTranslation("en-GB", enGB);
const fontConfig = {
  web: {
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "sans-serif-medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "sans-serif-light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "sans-serif-thin",
      fontWeight: "normal",
    },
  },
  ios: {
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "sans-serif-medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "sans-serif-light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "sans-serif-thin",
      fontWeight: "normal",
    },
  },
  android: {
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "sans-serif-medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "sans-serif-light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "sans-serif-thin",
      fontWeight: "normal",
    },
  },
};

const theme = {
  ...paperDefaultTheme,
  colors: {
    ...paperDefaultTheme.colors,
    primary: "#012970",
    secondary: "red",
    facebook: "#3b5998",
    instagram: "#C13584",
    linkedin: "#0077b5",
    twitter: "#1DA1F2",
  },
  fonts: configureFonts(fontConfig),
};

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <UserApplicationsProvider>
            <LandingNavigation />
          </UserApplicationsProvider>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
