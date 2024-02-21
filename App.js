import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

const fontConfig = {
  web: {
    regular: {
      fontFamily: "JakartaSansSatoshi-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "JakartaSansSatoshi-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "JakartaSansSatoshi-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "JakartaSansSatoshi-Thin",
      fontWeight: "normal",
    },
  },
  ios: {
    regular: {
      fontFamily: "JakartaSansSatoshi-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "JakartaSansSatoshi-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "JakartaSansSatoshi-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "JakartaSansSatoshi-Thin",
      fontWeight: "normal",
    },
  },
  android: {
    regular: {
      fontFamily: "JakartaSansSatoshi-Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "JakartaSansSatoshi-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "JakartaSansSatoshi-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "JakartaSansSatoshi-Thin",
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
  },
  fonts: configureFonts(fontConfig),
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <LandingNavigation />
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>

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
