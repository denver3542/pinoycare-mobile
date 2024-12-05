import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  TouchableHighlight,
} from "react-native";
import { Button, Appbar } from "react-native-paper";
import { Camera } from "expo-camera/legacy";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";
import { useUser } from "../../../../hooks/useUser";

const VerificationScreen = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const submitId = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please capture an image.");
      return;
    }
  
    let formData = new FormData();
    formData.append("verification", {
      uri: imageUri,
      type: `image/${fileName.split(".").pop().toLowerCase()}`,
      name: fileName,
    });
  
    setLoading(true);
 
    try {
      navigation.navigate("FacialRecognition");
   
      const response = await axiosInstance.post(
        "/user/profile/submit-verification",
        formData,
        {
          headers: {
            ...getJWTHeader(user),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await AsyncStorage.setItem( "verificationData",JSON.stringify(response.data));
      queryClient.invalidateQueries("verificationData");
      console.log(response.data);
    } catch (error) {
      console.error("Failed to submit verification:", error);
      Alert.alert(
        "Error",
        "Failed to submit verification. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  

  const captureImage = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      const selectedFileName = photo.uri.split("/").pop();

      setImageUri(photo.uri);
      setFileName(selectedFileName);
    }
  };

  const retakeImage = () => {
    setImageUri(null); 
  };

  // if (hasPermission === null) {
  // }
  
  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F7FB" }}>
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Camera
              style={styles.camera}
              type={Camera.Constants.Type.back}
              ref={(ref) => setCameraRef(ref)}
            />
          )}
        </View>
       
      </View>
      <View style={styles.buttonContainer}>
      {!imageUri ? (
          <Button mode="outlined" onPress={captureImage}>
            Capture ID
          </Button>
        ) : (
          <Button mode="outlined" onPress={retakeImage}>
            Recapture ID
          </Button>
        )}
        <Button
          mode="contained"
          loading={loading}
          onPress={submitId}
          disabled={!imageUri}
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
    padding: 20,
  },
  cameraContainer: {
    height: 400,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  buttonContainer: {
    padding: 20,
    gap: 5,
  },
});

export default VerificationScreen;
