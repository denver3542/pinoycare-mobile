import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

async function verifyUser(userToVerify) {
    try {
        console.log('Verify Data:', userToVerify);
        const userStr = await AsyncStorage.getItem("upcare_user");
        if (!userStr) {
            throw new Error("User not found");
        }
        const user = JSON.parse(userStr);

        const headers = getJWTHeader(user);
        const { data } = await axiosInstance.post("/user/profile/submit-verification", userToVerify, { headers });

        // Check if the response contains any validation errors
        if (data.error) {
            throw new Error(data.error); // Handle validation errors
        }

        // Update the stored user data with the verification data
        const updatedUser = { ...user, ...data.verificationData };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));

        console.log('Stored User Data:', updatedUser); // Log the updated user data

        return updatedUser; // Return the updated user data
    } catch (error) {
        throw new Error("Failed to submit verification: " + error.message);
    }
}

export const useVerifyUser = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        verifyUser,
        {
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(['user'], updatedUser);
                navigation.goBack();
            },
            onError: (error) => {
                console.error("Failed to submit verification:", error);
                // Handle error, display error message to the user, etc.
            },
            onSettled: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );
};
