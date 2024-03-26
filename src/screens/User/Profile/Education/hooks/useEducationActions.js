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

async function updateEducation(dataToUpdate, user) {
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const headers = getJWTHeader(user);
        console.log('Headers:', headers); // Log headers
        console.log('Data to update:', dataToUpdate); // Log data to update
        const { data } = await axiosInstance.put("/user/profile/edit-educations", dataToUpdate, { headers });
        console.log('Response data:', data); // Log response data
        const updatedUser = { ...user, ...data };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
        // console.log('Updated user:', updatedUser);
        return data.user;
    } catch (error) {
        if (error.response && error.response.status === 422) {
            // Handle validation errors
            console.error("Failed to update education - Validation error:", error.response.data);
            throw new Error("Failed to update education: " + JSON.stringify(error.response.data));
        } else {
            console.error("Failed to update education:", error);
            throw new Error("Failed to update education: " + error.message);
        }
    }
}



export const useUpdateEducations = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToUpdate) => {
            try {
                const userStr = await AsyncStorage.getItem("upcare_user");
                console.log('User string from AsyncStorage:', userStr);
                const user = userStr ? JSON.parse(userStr) : null;
                console.log('Parsed user:', user);
                await updateEducation(dataToUpdate, user);
            } catch (error) {
                throw new Error("Failed to update education: " + error.message);
            }
        },
        {
            onMutate: () => { },
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(['user'], updatedUser);
                console.log('Education update successfully');
                navigation.goBack();
            },
            onError: (error) => {
                console.error("Error updating education:", error);
                alert("Error updating education: " + error.message);
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['user'] });
            },
        }
    );
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

