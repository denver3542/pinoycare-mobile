import React from "react";
import { Dimensions, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import logo from "../../assets/icon.png";
import { Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Vision from "../sections/Home/Vision";
import ChoosePinoyCare from "../sections/Home/ChoosePinoyCare";

function Home({ navigation }) {
  const theme = useTheme();
  const Title = 'Welcome to Pinoy';
  const spanTitle = 'Care';
  const uppercaseTitle = Title.toUpperCase();
  const uppercaseSpanTitle = spanTitle.toUpperCase();

  const windowHeight = Dimensions.get("screen").height;
  return (
    <ScrollView>
      <ImageBackground
        source={{ uri: 'https://pinoycareph.com/assets/images/hero-bg.jpg' }}
        style={[styles.backgroundImage, { height: windowHeight }]}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Image source={logo} style={{ width: 200, height: 200 }} />
            <Text
              variant="displaySmall"
              style={styles.content}
            >
              {uppercaseTitle}
              <Text
                variant="displaySmall"
                style={{ fontWeight: "bold", color: "red" }}
              >
                {uppercaseSpanTitle}
              </Text>
            </Text>
            <Text
              variant="headlineSmall"
              style={{
                fontWeight: "100",
                color: theme.colors.primary,
                textShadowColor: '#001c4e',
                textShadowOffset: { width: 0.5, height: 0.5 },
                textShadowRadius: 1,
              }}
            >
              The Best Way to Care!
            </Text>
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
                style={styles.btnLogin}
                contentStyle={styles.btnContent}
                labelStyle={styles.btnLabel}
                mode="contained"
                onPress={() => navigation.navigate("Login")}
              >
                GET STARTED
              </Button>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 800,
  },
  container: {
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  innerContainer: {
    alignItems: "center",
  },
  content: {
    color: '#001c4e',
    textAlign: "center",
    fontWeight: 'bold',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  btnLogin: {
    width: "70%",
    marginBottom: 10,
  },
  btnContent: {
    paddingVertical: 8,
  },
  btnLabel: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  btnRegister: {
    width: "70%",
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#001c4e ',
  },
  btnRegisterLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001c4e'
  },
});
