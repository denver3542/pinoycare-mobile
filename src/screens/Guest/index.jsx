import React from "react";
import { SafeAreaView, View } from "react-native";
import { Appbar } from "react-native-paper";
import CustomGuestTopTabs from "../../components/CustomGuestTopTabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

export default function Index() {
  const navigation = useNavigation();

  const loginBtn = () => {
    navigation.navigate("Login");
  };
  const registerBtn = () => {
    navigation.navigate("SignUp");
  };
  return (
    <>
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.Content title="Upcare" mode="medium" />
          <Appbar.Action icon="login" onPress={loginBtn} />
          <Appbar.Action
            icon="account-plus-outline"
            onPress={registerBtn}
            style={{}}
          />
        </Appbar.Header>
        <View style={{ flex: 1, height: 500 }}>
          <CustomGuestTopTabs />
        </View>
      </View>
    </>
  );
}
