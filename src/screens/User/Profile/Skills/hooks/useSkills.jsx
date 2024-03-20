import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";
async function addSkills(dataToUpdate, user) {
    if (!user) {
        throw new Error("User not found");
    }

    const headers = getJWTHeader(user);
    const { data } = await axiosInstance.post("/user/profile/add-skills", dataToUpdate, { headers });
    const updatedUser = { ...user, ...dataToUpdate };
    await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
    return data.user;
}

export default function useSkills() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToUpdate) => {
            const userStr = await AsyncStorage.getItem("upcare_user");
            const user = userStr ? JSON.parse(userStr) : null;
            return addSkills(dataToUpdate, user);
        },
        {
            onMutate: () => {
                // Optionally, set some global or context-based loading state here
            },
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(['user'], updatedUser);
                queryClient.invalidateQueries(['user']);
                // Trigger navigation here after the mutation is successful
                navigation.goBack();
            },
            onError: (error) => {
                console.error("Error adding skills:", error);
                // Handle error state update or show a notification here
            },
            onSettled: () => {
                // Reset any global loading states or perform any cleanup necessary
            },
        }
    );
}
