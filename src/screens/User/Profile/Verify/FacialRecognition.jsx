import { Image, StyleSheet, View, Animated, Easing, Alert } from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Appbar,
  Button,
  Text,
  useTheme,
  Portal,
  Modal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import {
  Camera,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";
import { MaterialIcons } from "@expo/vector-icons";
import { useVerifyUser } from "./hooks/useVerifyUser";
import { Worklets } from "react-native-worklets-core";
import * as Progress from "react-native-progress";

const FaceDetection = ({ navigation }) => {
  const theme = useTheme();
  const animation = useRef(new Animated.Value(0)).current;
  const [progressValue, setProgressValue] = useState(0);
  const [progressText, setProgressText] = useState("Scanning your face");
  const progressAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const captureTriggeredRef = useRef(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);
  const [portalVisible, setPortalVisible] = useState(false);
  const cameraRef = useRef(null);
  const { hasPermission } = useCameraPermission()
  const device = useCameraDevice("front");

  const [cameraActive, setCameraActive] = useState(false);

  //Hook
  const { verifyFace } = useVerifyUser();

  const faceDetectionOptions =
    useRef <
    FaceDetectionOptions >
    {
      performanceMode: "accurate",
      landmarkMode: "none",
      contourMode: "none",
      classificationMode: "none",
      minFaceSize: 0.15,
    }.current;

  useEffect(() => {
    if (!hasPermission) return <View><Text>No Peermission</Text></View>

    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    progressAnim.addListener(({ value }) => {
      setProgressValue(value);
    });

    return () => {
      progressAnim.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (isFaceDetected) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
      captureTriggeredRef.current = false;
    }
  }, [isFaceDetected]);

  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) {
        console.error("Camera reference is not set.");
        Alert.alert("Error", "Camera not ready. Please try again.");
        return;
      }

      console.log("Attempting to capture photo...");
      const photo = await cameraRef.current.takePhoto();

      if (!photo || !photo.path) {
        console.error("No photo captured or invalid path.");
        Alert.alert("Error", "Failed to capture photo. Please try again.");
        return;
      }

      const faceImage = {
        uri: `file://${photo.path}`,
        type: "image/jpeg",
        name: photo.path.split("/").pop(),
      };

      console.log("Prepared faceImage for verification:", faceImage);

      setCapturedPhotoUri(faceImage.uri);
      setPortalVisible(true);

      await verifyFace.mutateAsync(faceImage);

      console.log("Face verification successful!");
    } catch (error) {
      console.error("Error capturing photo or verifying face:", error);

      setCapturedPhotoUri(null);
      setPortalVisible(false);

      Alert.alert(
        "Verification Failed",
        error.message || "An error occurred during face verification."
      );
    }
  };

  const handleFacesDetection = useCallback(
    async (faces) => {
      if (faces.length === 0) {
        if (isFaceDetected) {
          console.log("No faces detected.");
          setIsFaceDetected(false);
        }
        setProgressText("No faces detected.");
        return;
      }

      console.log(`Detected ${faces.length} face(s).`);

      if (!isFaceDetected) {
        setIsFaceDetected(true);
      }

      let text = "Scanning your face";
      let newProgressValue = progressValue;

      if (progressValue >= 0.2 && progressValue < 0.5) {
        text = "Align your face";
        newProgressValue = Math.min(progressValue + 0.1, 0.5);
      } else if (progressValue >= 0.5 && progressValue < 1) {
        text = "Verifying...";
        newProgressValue = Math.min(progressValue + 0.1, 1);
      } else if (progressValue === 1) {
        text = "Verification Successful!";
        if (!captureTriggeredRef.current) {
          captureTriggeredRef.current = true;
          capturePhoto();
        }
      }

      if (newProgressValue !== progressValue) {
        setProgressText(text);
        setProgressValue(newProgressValue);
      }
    },
    [isFaceDetected, progressValue, capturePhoto]
  );

  useEffect(() => {
    if (!cameraActive) {
      setPhotoCaptured(false);
      setIsFaceDetected(false);
    }
  }, [cameraActive]);

  const moveY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 40],
  });

  const handlePressGetStarted = () => {
    setCameraActive(true);
    setPhotoCaptured(false);
    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = (index) => {
    if (!photoCaptured && index === -1) {
      setCameraActive(false);
    }
  };

  const closePortal = () => {
    if (!photoCaptured) return;
    setPortalVisible(false);
  };

  if (!device) {
    return <Text style={styles.noDeviceText}>No Camera Device Found</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}></Appbar.Header>
      <View style={styles.container}>
        <Text style={styles.title}>Set up Facial Verification</Text>
        <Text style={styles.subtitle}>
          Scan your face to verify your identity
        </Text>
        <View style={{ flexGrow: 1 }}>
          <View style={styles.scanArea}>
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: moveY }] }]}
            />
            {Array.from({ length: 4 }, (_, index) => {
              const cornerStyles = [
                styles.cornerTopLeft,
                styles.cornerTopRight,
                styles.cornerBottomLeft,
                styles.cornerBottomRight,
              ];
              return <View key={index} style={cornerStyles[index]} />;
            })}
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handlePressGetStarted}
          style={styles.button}
        >
          Get started
        </Button>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%", "100%"]}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        {cameraActive && (
          <View style={styles.cameraWrapper}>
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={true}
                faceDetectionCallback={handleFacesDetection}
                faceDetectionOptions={faceDetectionOptions}
                photo={true}
              />
            </View>

            <View style={{ paddingHorizontal: 15, gap: 20, marginTop: 20 , alignItems: 'center'}}>
              <Text style={styles.statusText}>
                {isFaceDetected
                  ? progressText
                  : "No face detected, please adjust your position."}
              </Text>

              <Progress.Bar
                progress={progressValue}
                width={350}
                color={theme.colors.primary}
                borderRadius={12}
                height={10}
                style={styles.progressBar}
              />

              <Text style={styles.instructionText}>
                Please keep your face centered on the screen and facing forward.
              </Text>
            </View>
          </View>
        )}
      </BottomSheet>

      <Portal>
        <Modal
          visible={portalVisible}
          onDismiss={closePortal}
          contentContainerStyle={styles.portalContainer}
        >
          <Dialog.Title style={{ textAlign: "center" }}>Success</Dialog.Title>
          <Dialog.Content style={{ alignItems: "center" }}>
            <Paragraph style={{ marginBottom: 16 }}>
              Face verified successfully!
            </Paragraph>

            <View style={styles.imageContainer}>
              {capturedPhotoUri ? (
                <Image
                  source={{ uri: capturedPhotoUri }}
                  style={styles.capturedImage}
                />
              ) : (
                <Text style={styles.fallbackText}>No image available</Text>
              )}
            </View>

            <MaterialIcons
              name="check-circle"
              size={25}
              color="green"
              style={styles.successIcon}
            />
          </Dialog.Content>
          <Button
            mode="contained"
            onPress={() => {
              closePortal();
              navigation.navigate("Account");
            }}
            style={styles.doneButton}
          >
            Close
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0A3480",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 50,
    textAlign: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  scanLine: {
    position: "absolute",
    left: 30,
    right: 30,
    height: 5,
    backgroundColor: "#0A3480",
    borderRadius: 12,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderColor: "#0A3480",
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderColor: "#0A3480",
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderColor: "#0A3480",
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderColor: "#0A3480",
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 8,
  },
  button: {
    width: "100%",
    marginBottom: 8,
    borderRadius: 12,
  },
  camera: {
    flex: 1,
  },
  cameraWrapper: {
    flex: 1,
    marginVertical: 40,
    alignItems: "center",
  },
  cameraContainer: {
    width: 350,
    height: 400,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "black",
  },
  noDeviceText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginTop: 20,
  },
  portalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  capturedImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: "cover",
  },
  imageContainer: {
    position: "relative",
    width: 200,
    height: 200,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  successIcon: {
    position: "absolute",
    right: 8,
    top: 20,
    backgroundColor: "white",
    borderRadius: 100,
    padding: 2,
  },
  doneButton: {
    width: "80%",
    marginTop: 20,
  },
});

export default FaceDetection;
