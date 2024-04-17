import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";

async function addWorkExperience(dataToUpdate, user) {
    if (!user) {
        throw new Error("User not found");
    }

    const headers = getJWTHeader(user);

    console.log("Headers:", headers);

    try {
        const { data } = await axiosInstance.post("/user/profile/add-experience", dataToUpdate, { headers });
        const updatedUser = { ...user, ...dataToUpdate };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
        return data.user;
    } catch (error) {
        console.error("Error in addWorkExperience:", error);

        throw new Error(`Failed to add work experience: ${error.message}`);
    }
}

export const useWorkExperience = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToUpdate) => {
            try {
                const userStr = await AsyncStorage.getItem("upcare_user");
                console.log('User string from AsyncStorage:', userStr);
                const user = userStr ? JSON.parse(userStr) : null;
                console.log('Parsed user:', user);
                await addWorkExperience(dataToUpdate, user);
            } catch (error) {
                throw new Error(`Failed to add work experience: ${error.message}`);
            }
        },
        {
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(['user'], updatedUser);
                console.log('Work experience added successfully:', updatedUser);
                navigation.goBack();
            },
            onError: (error) => {
                console.error('Failed to save work experience:', error);
            },
            onSettled: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );
};

async function updateWorkExperience(dataToEdit, user) {
    if (!user) {
        throw new Error("User Not Found")
    }
    const headers = {
        ...getJWTHeader(user),
        'Content-Type': 'multipart/form-data',
    };

    try {
        const { data } = await axiosInstance.post("/user/profile/update-experience", dataToEdit, { headers });

        const updatedUser = {
            ...user,
            ...data.user,
        };
        await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
        return updatedUser;
    } catch (error) {
        throw error;
    }
}



export const useUpdateWorkExperience = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToEdit) => {
            const userStr = await AsyncStorage.getItem("upcare_user");
            const user = userStr ? JSON.parse(userStr) : null;
            if (!user) throw new Error("User session not found.");
            return await updateWorkExperience(dataToEdit, user);
        },
        {
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(['user'], updatedUser);
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

