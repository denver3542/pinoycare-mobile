import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";

// Function to submit verification data
// async function submitVerification(verificationData, user) {
//     if (!user) {
//         throw new Error("User not found");
//     }

//     try {
//         const headers = getJWTHeader(user);
//         const formData = new FormData();

//         // Append front and back images from verificationData
//         verificationData.forEach((verification, index) => {
//             formData.append(`verification[${index}][frontImage]`, {
//                 uri: verification.frontImage,
//                 type: 'image/jpeg', // Ensure correct MIME type
//                 name: `frontImage_${index}.jpg`,
//             });

//             formData.append(`verification[${index}][backImage]`, {
//                 uri: verification.backImage,
//                 type: 'image/jpeg', // Ensure correct MIME type
//                 name: `backImage_${index}.jpg`,
//             });
//         });

//         console.log('FormData for verification:', formData);

//         const { data } = await axiosInstance.post("/user/profile/submit-verification", formData, {
//             headers: {
//                 ...headers,
//                 'Content-Type': 'multipart/form-data',
//             }
//         });

//         console.log('Response data for verification:', data);

//         const updatedUser = { ...user, ...data.user };
//         await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));

//         return data.user;
//     } catch (error) {
//         console.error('Error submitting verification:', error);

//         if (error.response && error.response.status === 400) {
//             throw new Error("Failed to submit verification: " + JSON.stringify(error.response.data));
//         } else {
//             throw new Error("Failed to submit verification: " + error.message);
//         }
//     }
// }

// Function to verify face image
async function verifyFace(faceImage, user) {
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const headers = getJWTHeader(user);
        const formData = new FormData();

        // Append the face verification image
        if (faceImage) {
            formData.append('verification', {
                uri: faceImage.uri,
                type: faceImage.type || 'image/jpeg',
                name: faceImage.name || 'face_verification.jpg',
            });
        }

        console.log('FormData for face verification:', formData);

        const { data } = await axiosInstance.post("/user/verify-face", formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data',
            }
        });

        console.log('Response data for face verification:', data);

        const updatedUser = { ...user, ...data.user };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));

        return data.user;
    } catch (error) {
        console.error('Error submitting face verification:', error);

        if (error.response && error.response.status === 400) {
            throw new Error("Failed to submit face verification: " + JSON.stringify(error.response.data));
        } else {
            throw new Error("Failed to submit face verification: " + error.message);
        }
    }
}

// Custom hook to use verification functionality
export const useVerifyUser = () => {


    return {
        verifyFace: useMutation(async (faceImage) => {
            try {
                const userStr = await AsyncStorage.getItem("upcare_user");
                const user = userStr ? JSON.parse(userStr) : null;
                return await verifyFace(faceImage, user);
            } catch (error) {
                throw new Error("Face Verification Failed: " + error.message);
            }
        }),
    };
};
