import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";

async function submitVerification(verificationData, user) {
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const headers = getJWTHeader(user);
        const formData = new FormData();

        // Append each file to the formData object
        verificationData.forEach((item, index) => {
            formData.append(`verification[${index}][frontImage]`, { uri: item.frontImage, name: `frontImage_${index}.jpg`, type: 'image/jpeg' });
            formData.append(`verification[${index}][backImage]`, { uri: item.backImage, name: `backImage_${index}.jpg`, type: 'image/jpeg' });
        });

        // Send the formData to the server
        const { data } = await axiosInstance.post("/user/profile/submit-verification", formData, { headers });

        // Update the user data in AsyncStorage
        const updatedUser = { ...user, ...data.user };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));

        return data.user;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("Failed to submit verification: " + JSON.stringify(error.response.data));
        } else {
            throw new Error("Failed to submit verification: " + error.message);
        }
    }
}

export const useVerifyUser = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (verificationData) => {
            try {
                const userStr = await AsyncStorage.getItem("upcare_user");
                const user = userStr ? JSON.parse(userStr) : null;
                await submitVerification(verificationData, user);
            } catch (error) {
                throw new Error("User ID Verification Failed: " + error.message);
            }
        },
        {
            onSuccess: (data) => {
                queryClient.setQueryData(['user'], data);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['user'] });
            }
        }
    );
};
