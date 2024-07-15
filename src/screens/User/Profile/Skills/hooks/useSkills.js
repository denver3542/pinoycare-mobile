import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";

const getUser = async () => {
    const userStr = await AsyncStorage.getItem("upcare_user");
    return userStr ? JSON.parse(userStr) : null;
};

const updateUserSkills = async (user, skill) => {
    const updatedUser = {
        ...user,
        skills: [...user.skills, skill],
    };
    await AsyncStorage.setItem('upcare_user', JSON.stringify(updatedUser));
    return updatedUser;
};

const addSkill = async (skillName, user) => {
    if (!user) {
        throw new Error("User not found");
    }
    const headers = getJWTHeader(user);
    const { data } = await axiosInstance.post("/user/profile/add-skills", { skills: skillName }, { headers });
    return data.skill;
};

export default function useSkills() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        async (skillName) => {
            const user = await getUser();
            if (!skillName) {
                throw new Error("A skill is required");
            }
            return addSkill(skillName, user);
        },
        {
            onMutate: async (newSkill) => {
                await queryClient.cancelQueries(['user']);
                const previousUser = queryClient.getQueryData(['user']);
                queryClient.setQueryData(['user'], (oldUser) => ({
                    ...oldUser,
                    skills: [...oldUser.skills, { skill_name: newSkill }],
                }));
                return { previousUser };
            },
            onError: (err, newSkill, context) => {
                queryClient.setQueryData(['user'], context.previousUser);
            },
            onSuccess: async (data) => {
                const user = await getUser();
                await updateUserSkills(user, data);
                queryClient.invalidateQueries(['user']);
            },
        }
    );
}
