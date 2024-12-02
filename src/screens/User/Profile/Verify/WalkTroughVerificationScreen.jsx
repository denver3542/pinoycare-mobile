import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Title, Paragraph, Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const WalkThroughVerificationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F7FB"}}>
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        {/* <Appbar.Content title="ID Verification" /> */}
      </Appbar.Header>
      <View style={styles.container}>
        <View style={{ marginTop: 10, gap: 15 }}>
        <Title style={styles.imageTitle}>Photo ID Instruction</Title>
        <Text style={styles.description}>
          Please make sure to upload your ID for the verification process. It is
          important that they are clear and easy to read. Thank you!
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../../../../assets/images/front_sample.png")}
            style={styles.image}
          />
        </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("VerificationScreen")}
          style={styles.nextButton}
        >
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    width: "100%",
  },
  buttonContainer: {
    padding: 20,
  },
  nextButton: {
    alignSelf: "stretch",
  },
});

export default WalkThroughVerificationScreen;
