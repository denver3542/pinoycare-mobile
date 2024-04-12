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

        verificationData.forEach((verification, index) => {
            formData.append(`verification[${index}][frontImage]`, {
                uri: verification.frontImage,
                type: 'image/jpeg', // Make sure to set the correct MIME type
                name: `frontImage_${index}.jpg`,
            });

            formData.append(`verification[${index}][backImage]`, {
                uri: verification.backImage,
                type: 'image/jpeg', // Make sure to set the correct MIME type
                name: `backImage_${index}.jpg`,
            });
        });

        console.log('FormData:', formData);

        const { data } = await axiosInstance.post("/user/profile/submit-verification", formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data',
            }
        });

        console.log('Response data:', data);

        const updatedUser = { ...user, ...data.user };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));

        return data.user;
    } catch (error) {
        console.error('Error submitting verification:', error);

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
