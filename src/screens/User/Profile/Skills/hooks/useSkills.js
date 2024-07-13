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
    const updatedUser = { ...user, skills: [...user.skills, ...dataToUpdate.skills] };
    await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
    return updatedUser;
}

export default function useSkills() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (dataToUpdate) => {
            const userStr = await AsyncStorage.getItem("upcare_user");
            const user = userStr ? JSON.parse(userStr) : null;
            if (!dataToUpdate.skills || dataToUpdate.skills.length === 0) {
                throw new Error("At least one skill is required");
            }
            return addSkills(dataToUpdate, user);
        },
        {
            onMutate: async (newSkills) => {
                await queryClient.cancelQueries(['user']);
                const previousUser = queryClient.getQueryData(['user']);

                queryClient.setQueryData(['user'], (oldUser) => ({
                    ...oldUser,
                    skills: [...oldUser.skills, ...newSkills.skills],
                }));

                return { previousUser };
            },
            onError: (err, newSkills, context) => {
                queryClient.setQueryData(['user'], context.previousUser);
            },
            onSettled: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );
}
