import React, { useLayoutEffect, useState } from "react";
import { Dimensions, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import logo from "../../assets/icon.png";
import { Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Vision from "../sections/Home/Vision";
import ChoosePinoyCare from "../sections/Home/ChoosePinoyCare";
// import { useUser } from "../hooks/useUser";

function Home({ navigation }) {
  const theme = useTheme();
  const Title = 'Welcome to Up';
  const spanTitle = 'Care';
  const windowHeight = Dimensions.get("screen").height;

  // const { user, isFetching, isFetched } = useUser();
  const [loading, setLoading] = useState(true);

  // useLayoutEffect(() => {
  //   if (isFetched) {
  //     setLoading(false);
  //   }
  // }, [isFetched]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/hero-bg.jpg')}
        style={[styles.backgroundImage, { height: windowHeight }]}
      >
        <View style={styles.innerContainer}>
          <Image source={logo} style={{ width: 180, height: 180 }} />
          <Text
            variant="displaySmall"
            style={styles.content}
          >
            {Title}
            <Text
              variant="displaySmall"
              style={{ fontWeight: "bold", color: "red" }}
            >
              {spanTitle}
            </Text>
          </Text>
          <Text
            variant="headlineSmall"
            style={{
              fontWeight: "100",
              color: '#001c4e',
              textShadowColor: '#001c4e',
              textShadowOffset: { width: 0.5, height: 0.5 },
              textShadowRadius: 1,
              paddingTop: 10
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
              paddingTop: 30,
            }}
          >
            <Button
              style={styles.btnLogin}
              labelStyle={{
                width: 250,
                height: "auto",
                fontSize: 14, // Increase font size for larger text
                paddingVertical: 6, // Increase padding for taller button
              }}
              mode="contained"
              onPress={() => navigation.navigate("Login")}
            >
              GET STARTED
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>

  );
}

export default Home;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
  },
  innerContainer: {
    paddingTop: 130,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    textAlign: "center",
    fontWeight: 'bold',
  },
  btnLogin: {

    borderRadius: 50,
  },
  btnContent: {
    paddingVertical: 8,
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textShadow: {
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
});

