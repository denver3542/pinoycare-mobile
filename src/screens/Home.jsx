import React from "react";
import { StyleSheet, View } from "react-native";
import logo from "../../assets/icon.png";
import { Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

function Home({ navigation }) {
  const theme = useTheme();
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
          flex: 1,
          justifyContent: "flex-end",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image source={logo} style={{ width: 200, height: 200 }} />
        <Text
          variant="displayMedium"
          style={{
            fontWeight: "bold",
            color: theme.colors.primary,
            textAlign: "center",
          }}
        >
          Welcome to Pinoy
          <Text
            variant="displayMedium"
            style={{ fontWeight: "bold", color: "red" }}
          >
            Care
          </Text>
        </Text>
        <Text
          variant="headlineMedium"
          style={{ fontWeight: "100", color: theme.colors.primary }}
        >
          The Best Way to Care!
        </Text>
      </View>
      <View
        style={{
          flex: 0.7,
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Button
          style={styles.btn}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
          mode="contained"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>
        <Button
          style={styles.btn}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
          mode="contained"
          onPress={() => navigation.navigate("SignUp")}
          buttonColor={theme.colors.onSurfaceDisabled}
        >
          Register
        </Button>
      </View>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  btn: {
    width: "90%",
    marginBottom: 10,
  },
  btnContent: {
    paddingVertical: 8,
  },
  btnLabel: {
    fontSize: 20,
  },
});
