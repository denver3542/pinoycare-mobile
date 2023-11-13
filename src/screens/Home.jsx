import React from "react";
import { View } from "react-native";
import { Text } from "@rneui/themed";
import { Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import logo from "../../assets/icon.png";
import { Image } from "react-native";

function Home({ navigation }) {
  const { theme, updateTheme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Image source={logo} style={{ width: 200, height: 200 }} />
        <Text h1 h1Style={{ textAlign: "center", color: theme.colors.primary }}>
          Welcome to Pinoy
          <Text h1 h1Style={{ color: "red" }}>
            Care
          </Text>
        </Text>
        <Text h4 h4Style={{ fontWeight: "100", color: theme.colors.primary }}>
          The Best Way to Care!
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <Button
          title="Login"
          size="lg"
          color={theme.colors.primary}
          buttonStyle={{ borderRadius: 16, width: "100%" }}
          titleStyle={{ fontSize: 30, textAlign: "center" }}
          containerStyle={{ marginTop: 30, width: "90%" }}
          onPress={() => navigation.navigate("Login")}
        />
        <Button
          title="Sign Up"
          size="lg"
          color={theme.colors.grey4}
          buttonStyle={{ borderRadius: 16, width: "100%" }}
          titleStyle={{ fontSize: 30, textAlign: "center" }}
          containerStyle={{ marginTop: 10, width: "90%" }}
          onPress={() => navigation.navigate("SignUp")}
        />
      </View>
    </View>
  );
}

export default Home;
