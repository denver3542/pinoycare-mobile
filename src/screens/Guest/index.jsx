import React from "react";
import { StyleSheet, View, Image } from "react-native";
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
        <Appbar.Header mode="small" style={{ backgroundColor: '#0A3480' }}>
          <Image source={require("../../../assets/pinoycare.png")} style={styles.imageStyle} />
          <Appbar.Content title="Upcare" titleStyle={{ color: 'white' }} />
          <Appbar.Action icon="login" onPress={loginBtn} color="white" />
          <Appbar.Action
            icon="account-plus-outline"
            onPress={registerBtn}
            color="white"
          />
        </Appbar.Header>
        <View style={{ flex: 1 }}>
          <CustomGuestTopTabs />
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  imageStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10
  },
});