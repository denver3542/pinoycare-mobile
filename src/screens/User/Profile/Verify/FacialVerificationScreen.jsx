// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { View, StyleSheet, Animated, Alert, Image } from "react-native";
// import {
//   Appbar,
//   Text,
//   Dialog,
//   Portal,
//   Paragraph,
//   useTheme,
//   Button,
// } from "react-native-paper";
// import { MaterialIcons } from "@expo/vector-icons";
// import BottomSheet from "@gorhom/bottom-sheet";
// import { Camera } from "expo-camera/legacy";
// import * as FaceDetector from "expo-face-detector";
// import * as Progress from "react-native-progress";
// import { useVerifyUser } from "./hooks/useVerifyUser";

// const FacialVerificationScreen = ({ navigation }) => {
//   const theme = useTheme();
//   const animation = useRef(new Animated.Value(0)).current;
//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const bottomSheetRef = useRef(null);
//   const cameraRef = useRef(null);
//   const captureTriggeredRef = useRef(false);
//   const [hasPermission, setHasPermission] = useState(null);
//   const [type] = useState(Camera.Constants.Type.front);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [faceDetected, setFaceDetected] = useState(false);
//   const [progressValue, setProgressValue] = useState(0);
//   const [progressText, setProgressText] = useState("Scanning your face");
//   const [dialogVisible, setDialogVisible] = useState(false);
//   const [capturedImageUri, setCapturedImageUri] = useState(null);
//   const [isVerified, setIsVerified] = useState(false);

//   const [cameraDimensions, setCameraDimensions] = useState({
//     width: 0,
//     height: 0,
//   });

//   const moveY = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-40, 40],
//   });

//   const { verifyFace } = useVerifyUser();

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(animation, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(animation, {
//           toValue: 0,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   useEffect(() => {
//     progressAnim.addListener(({ value }) => {
//       setProgressValue(value);
//     });

//     return () => {
//       progressAnim.removeAllListeners();
//     };
//   }, []);

//   useEffect(() => {
//     if (faceDetected && !isVerified) {
//       Animated.timing(progressAnim, {
//         toValue: 1,
//         duration: 3000,
//         useNativeDriver: false,
//       }).start();
//     } else {
//       Animated.timing(progressAnim, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//       captureTriggeredRef.current = false;
//     }
//   }, [faceDetected, isVerified]);

//   const handleFaceCapture = async () => {
//     try {
//       if (cameraRef.current && !isVerified) {
//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.5,
//           base64: true,
//           mirrorImage: false,
//         });

//         if (!photo || !photo.uri) {
//           console.error("No photo captured or invalid URI.");
//           Alert.alert("Error", "Failed to capture image. Please try again.");
//           return;
//         }

//         const fileName = photo.uri.split("/").pop();
//         const faceImage = {
//           uri: photo.uri,
//           type: "image/jpeg",
//           name: fileName,
//         };

//         setCapturedImageUri(photo.uri);

//         await verifyFace.mutateAsync(faceImage);
//         setIsVerified(true);
//         showDialog();
//       } else {
//         console.error("Camera ref is not set or already verified.");
//         Alert.alert(
//           "Error",
//           "Camera not ready or verification already completed."
//         );
//       }
//     } catch (error) {
//       console.error("Error during face capture or verification:", error);
//     }
//   };

//   const handleFacesDetected = useCallback(
//     ({ faces }) => {
//       if (faces.length > 0 && !isVerified) {
//         setFaceDetected(true);
//       } else {
//         setFaceDetected(false);
//       }

//       if (!isVerified) {
//         let text = "Scanning your face";
//         if (progressValue >= 0.2 && progressValue < 0.5) {
//           text = "Align your face";
//         } else if (progressValue >= 0.5 && progressValue < 1) {
//           text = "Verifying...";
//         } else if (progressValue === 1) {
//           text = "Verification Successful!";
//           if (!captureTriggeredRef.current) {
//             captureTriggeredRef.current = true;
//             handleFaceCapture();
//           }
//         }
//         setProgressText(text);
//       }
//     },
//     [progressValue, handleFaceCapture, isVerified]
//   );

//   const handlePressGetStarted = () => {
//     setCameraActive(true);
//     bottomSheetRef.current?.expand();
//   };

//   const handleSheetChanges = (index) => {
//     if (index === -1) setCameraActive(false);
//   };

//   const handleCameraLayout = (event) => {
//     const { width, height } = event.nativeEvent.layout;
//     setCameraDimensions({ width, height });
//   };

//   const showDialog = () => setDialogVisible(true);
//   const hideDialog = () => setDialogVisible(false);

//   if (hasPermission === null) return <View />;
//   if (hasPermission === false) return <Text>No access to camera</Text>;

//   return (
//     <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
//       <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
//         {/* <Appbar.BackAction onPress={() => navigation.goBack()} color="white" /> */}
//         {/* <Appbar.Content title="Facial Verification" color="white" /> */}
//       </Appbar.Header>

//       <View style={styles.container}>
//         <Text style={styles.title}>Set up Facial Verification</Text>
//         <Text style={styles.subtitle}>
//           Scan your face to verify your identity
//         </Text>
//         <View style={{ flexGrow: 1 }}>
//           <View style={styles.scanArea}>
//             <Animated.View
//               style={[styles.scanLine, { transform: [{ translateY: moveY }] }]}
//             />
//             {Array.from({ length: 4 }, (_, index) => {
//               const cornerStyles = [
//                 styles.cornerTopLeft,
//                 styles.cornerTopRight,
//                 styles.cornerBottomLeft,
//                 styles.cornerBottomRight,
//               ];
//               return <View key={index} style={cornerStyles[index]} />;
//             })}
//           </View>
//         </View>

//         <Button
//           mode="contained"
//           onPress={handlePressGetStarted}
//           style={styles.button}
//           disabled={hasPermission === null || isVerified}
//         >
//           Get started
//         </Button>
//       </View>

//       <BottomSheet
//         ref={bottomSheetRef}
//         index={-1}
//         snapPoints={["50%", "100%"]}
//         enablePanDownToClose={true}
//         onChange={handleSheetChanges}
//       >
//         {cameraActive && (
//           <View style={styles.cameraWrapper}>
//             <View style={styles.cameraContainer}>
//               <Camera
//                 ref={cameraRef}
//                 style={styles.camera}
//                 type={type}
//                 onLayout={handleCameraLayout}
//                 onFacesDetected={handleFacesDetected}
//                 faceDetectorSettings={{
//                   mode: FaceDetector.FaceDetectorMode.fast,
//                   detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
//                   runClassifications:
//                     FaceDetector.FaceDetectorClassifications.none,
//                   minDetectionInterval: 2000,
//                   tracking: true,
//                 }}
//               />
//             </View>

//             <View style={{ paddingHorizontal: 20, gap: 20, marginTop: 20 }}>
//               <Text style={styles.statusText}>
//                 {faceDetected
//                   ? progressText
//                   : "No face detected, please adjust your position."}
//               </Text>

//               <Progress.Bar
//                 progress={progressValue}
//                 width={300}
//                 color={theme.colors.primary}
//                 borderRadius={12}
//                 height={10}
//                 style={styles.progressBar}
//               />

//               <Text style={styles.instructionText}>
//                 Please keep your face centered on the screen and facing forward.
//               </Text>
//             </View>
//           </View>
//         )}
//       </BottomSheet>

//       <Portal>
//         <Dialog
//           visible={dialogVisible}
//           style={{ backgroundColor: "#fff", padding: 20 }}
//         >
//           <Dialog.Title style={{ textAlign: "center" }}>Success</Dialog.Title>
//           <Dialog.Content style={{ alignItems: "center" }}>
//             <Paragraph style={{ marginBottom: 16 }}>
//               Face verified successfully!
//             </Paragraph>
//             <View
//               style={{
//                 position: "relative",
//                 width: 200,
//                 height: 200,
//                 marginBottom: 16,
//               }}
//             >
//               {capturedImageUri && (
//                 <Image
//                   source={{ uri: capturedImageUri }}
//                   style={{
//                     width: 200,
//                     height: 200,
//                     borderRadius: 100,
//                     transform: [{ scaleX: -1 }],
//                   }}
//                 />
//               )}
//               <MaterialIcons
//                 name="check-circle"
//                 size={25}
//                 color="green"
//                 style={{
//                   position: "absolute",
//                   right: 8,
//                   top: 20,
//                   backgroundColor: "white",
//                   borderRadius: 100,
//                   padding: 2,
//                 }}
//               />
//             </View>
//           </Dialog.Content>
//           <Dialog.Actions style={{ justifyContent: "center" }}>
//             <Button
//               mode="contained"
//               onPress={() => {
//                 hideDialog();
//                 navigation.navigate("Account");
//               }}
//               style={{ width: "100%" }}
//             >
//               Okay
//             </Button>
//           </Dialog.Actions>
//         </Dialog>
//       </Portal>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#0A3480",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#888",
//     marginBottom: 50,
//     textAlign: "center",
//   },
//   scanArea: {
//     width: 250,
//     height: 250,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//     position: "relative",
//   },
//   scanLine: {
//     position: "absolute",
//     left: 30,
//     right: 30,
//     height: 5,
//     backgroundColor: "#0A3480",
//     borderRadius: 12,
//   },
//   progressBar: {
//     marginTop: 10,
//     height: 10,
//   },

//   instructionText: {
//     marginTop: 5,
//     fontSize: 14,
//     color: "gray",
//   },
//   button: {
//     width: "100%",
//     marginBottom: 8,
//     borderRadius: 12,
//   },
//   cameraWrapper: {
//     flex: 1,
//     marginVertical: 40,
//     // justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraContainer: {
//     width: 350,
//     height: 400,
//     borderRadius: 14,
//     overflow: "hidden",
//     backgroundColor: "black",
//   },
//   camera: {
//     flex: 1,
//   },
//   bottomSheetContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//   },

//   cornerTopLeft: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: 20,
//     height: 20,
//     borderColor: "#0A3480",
//     borderLeftWidth: 4,
//     borderTopWidth: 4,
//     borderTopLeftRadius: 8,
//   },
//   cornerTopRight: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     width: 20,
//     height: 20,
//     borderColor: "#0A3480",
//     borderRightWidth: 4,
//     borderTopWidth: 4,
//     borderTopRightRadius: 8,
//   },
//   cornerBottomLeft: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     width: 20,
//     height: 20,
//     borderColor: "#0A3480",
//     borderLeftWidth: 4,
//     borderBottomWidth: 4,
//     borderBottomLeftRadius: 8,
//   },
//   cornerBottomRight: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     width: 20,
//     height: 20,
//     borderColor: "#0A3480",
//     borderRightWidth: 4,
//     borderBottomWidth: 4,
//     borderBottomRightRadius: 8,
//   },

//   cameraCornerTopLeft: {
//     position: "absolute",
//     top: 20,
//     left: 20,
//     width: 30,
//     height: 30,
//     borderColor: "#F9F9F9",
//     borderLeftWidth: 4,
//     borderTopWidth: 4,
//     borderTopLeftRadius: 14,
//   },
//   cameraCornerTopRight: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     width: 30,
//     height: 30,
//     borderColor: "#F9F9F9",
//     borderRightWidth: 4,
//     borderTopWidth: 4,
//     borderTopRightRadius: 14,
//   },
//   cameraCornerBottomLeft: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     width: 30,
//     height: 30,
//     borderColor: "#F9F9F9",
//     borderLeftWidth: 4,
//     borderBottomWidth: 4,
//     borderBottomLeftRadius: 14,
//   },
//   cameraCornerBottomRight: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     width: 30,
//     height: 30,
//     borderColor: "#F9F9F9",
//     borderRightWidth: 4,
//     borderBottomWidth: 4,
//     borderBottomRightRadius: 14,
//   },
//   statusText: {
//     fontWeight: "700",
//     fontSize: 16,
//     color: "#0A3480",
//     textAlign: "center",
//     marginTop: 10,
//   },
//   successContent: {
//     padding: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   capturedImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 10,
//     marginVertical: 10,
//   },
// });

// export default FacialVerificationScreen;
