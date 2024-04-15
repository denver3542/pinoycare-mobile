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

            throw new Error("Failed to add education: " + JSON.stringify(error.response.data));
        } else {
            throw new Error("Failed to add education: " + error.message);
        }
    }
}

export const useEducations = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToUpdate) => {
            try {
                const userStr = await AsyncStorage.getItem("upcare_user");
                console.log('User string from AsyncStorage:', userStr);
                const user = userStr ? JSON.parse(userStr) : null;
                console.log('Parsed user:', user);
                await addEducation(dataToUpdate, user);
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

            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['user'] });
            },
        }
    );
}




async function updateEducation(dataToEdit, user) {
    if (!user) {
        throw new Error("User not found");
    }

    const headers = getJWTHeader(user);
    try {
        const { data } = await axiosInstance.post("/user/profile/edit-educations", dataToEdit, { headers });
        const updatedUser = { ...user, ...data }; // Ensure server response data is used
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
        return updatedUser; // Return the updated user object
    } catch (error) {
        // Simplify error handling
        const errorMsg = error.response?.data?.error || error.message;
        throw new Error(`Failed to update education: ${errorMsg}`);
    }
}

export const useUpdateEducations = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToEdit) => {
            const userStr = await AsyncStorage.getItem("upcare_user");
            const user = userStr ? JSON.parse(userStr) : null;
            if (!user) throw new Error("User session not found.");
            return await updateEducation(dataToEdit, user); // Rely on updateEducation to throw errors
        },
        {
            onSuccess: (updatedUser) => {
                // console.log("Education updated successfully.", updatedUser);
                queryClient.setQueryData(['user'], updatedUser); // Use updatedUser from updateEducation
                navigation.goBack();
            },
            onError: (error) => {
                console.error("Failed to update education:", error);
            },
            onSettled: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );
}



