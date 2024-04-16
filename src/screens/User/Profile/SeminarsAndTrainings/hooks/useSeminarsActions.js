import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";

async function addSeminarsAndTrainings(dataToUpdate, user) {
    if (!user) {
        throw new Error("User not found");
    }

    const headers = {
        ...getJWTHeader(user),
        'Content-Type': 'multipart/form-data',
    };

    try {
        const { data } = await axiosInstance.post("/user/profile/store-trainings", dataToUpdate, { headers });

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

export const useSeminarsAndTrainings = () => {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToUpdate) => {
            const userStr = await AsyncStorage.getItem("upcare_user");
            const user = userStr ? JSON.parse(userStr) : null;
            if (!user) {
                throw new Error("User not found in storage.");
            }
            const updatedUser = await addSeminarsAndTrainings(dataToUpdate, user);
            return updatedUser;
        },
        {
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(['user'], updatedUser);
                navigation.goBack();
            },
            onSettled: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );
};
