import React from "react";
import { Image } from "react-native";
import { View } from "react-native";
import { Text } from "@rneui/themed";
import { Button } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import logo from "../../assets/icon.png";
import { Header } from "@rneui/themed";

function Login({ navigation }) {
  const { theme, updateTheme } = useTheme();
  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Image source={logo} style={{ width: 150, height: 150 }} />
          <Text h1>Login</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        ></View>
      </View>
    </>
  );
}

export default Login;
