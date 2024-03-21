import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";

async function addEducation(dataToUpdate, user) {
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const headers = getJWTHeader(user);
        const { data } = await axiosInstance.post("/user/profile/add-educations", dataToUpdate, { headers });
        const updatedUser = { ...user, ...dataToUpdate };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
        return data.user;
    } catch (error) {
        if (error.response && error.response.status === 422) {
            // Handle validation errors
            throw new Error("Failed to add education: " + JSON.stringify(error.response.data));
        } else {
            throw new Error("Failed to add education: " + error.message);
        }
    }
}


export default function useEducations() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToUpdate) => {
            try {
                const userStr = await AsyncStorage.getItem("upcare_user");
                const user = userStr ? JSON.parse(userStr) : null;
                return await addEducation(dataToUpdate, user);
            } catch (error) {
                throw new Error("Failed to add education: " + error.message);
            }
        },
        {
            onMutate: () => { },
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(['user'], updatedUser);
                console.log('Education added successfully:', updatedUser);
                navigation.goBack();
            },
            onError: (error) => {
                console.error("Error adding education:", error);
                alert("Error adding education: " + error.message);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['user'] });
            },
        }
    );
}

