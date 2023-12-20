import React, { useLayoutEffect, useState } from "react";
import { Dimensions, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import logo from "../../assets/icon.png";
import { Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Vision from "../sections/Home/Vision";
import ChoosePinoyCare from "../sections/Home/ChoosePinoyCare";
import { useUser } from "../hooks/useUser";

function Home({ navigation }) {
  const theme = useTheme();
  const Title = 'Welcome to Up';
  const spanTitle = 'Care';
  const windowHeight = Dimensions.get("screen").height;

  const { user, isFetching, isFetched } = useUser();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (isFetched) {
      setLoading(false);
    }
  }, [isFetched]);

  return (
    <ScrollView>
      <ImageBackground
        source={require('../../assets/images/hero-bg.jpg')}
        style={[styles.backgroundImage, { height: windowHeight }]}
      >
        <View style={styles.container}>
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
  },
  container: {
    flex: 1,
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
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    width: '100%'
  },
  btnLogin: {
    width: '100%',
    borderRadius: 100
  },
  btnContent: {
    paddingVertical: 8,
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
