import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";
async function verifyFace(faceImage, user) {
    if (!user) {
      throw new Error("User not found");
    }
 
      const headers = getJWTHeader(user);
      const formData = createFormData(faceImage);
  
      const { data } = await axiosInstance.post("/user/verify-face", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
  
      const updatedUser = { ...user, ...data.user };
      await AsyncStorage.setItem("upcare_user", JSON.stringify(updatedUser));

      return data.user;
  
  }
  
   function createFormData(faceImage) {
    if (!faceImage || !faceImage.uri) {
      throw new Error("Invalid face image provided");
    }
  
    const formData = new FormData();
    const fileName = faceImage.uri.split("/").pop();
    formData.append("verification", {
      uri: faceImage.uri.startsWith("file://") ? faceImage.uri : `file://${faceImage.uri}`,
      type: faceImage.type || "image/jpeg",
      name: fileName || "face_capture.jpg",
    });
  
  
    return formData;
  }
  
  
 
  export const useVerifyUser = () => {
    return {
      verifyFace: useMutation(async (faceImage) => {
        console.log("Starting face verification process with React Query...");
        const userStr = await AsyncStorage.getItem("upcare_user");
        const user = userStr ? JSON.parse(userStr) : null;
  
        if (!user) {
          throw new Error("User not logged in or user data is unavailable.");
        }
        return verifyFace(faceImage, user);
      }),
    };
  };