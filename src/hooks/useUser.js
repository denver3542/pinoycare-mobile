import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstancee, { getJWTHeader } from "../../utils/axiosConfig";
import { clearStoredUser, setStoredUser } from "../user-storage";

export async function getUser(signal) {
    let user = await AsyncStorage.getItem("pinoycare_user");
    if (!user) {
        // Logout the user
        return null;
    }

    const { data } = await axiosInstancee.get("/auth", {
        signal, // abortSignal from React Query
        headers: getJWTHeader(JSON.parse(user)),
    });
    return data.user;
}

export const useUser = () => {
    const queryClient = useQueryClient();
    const { data: user, isLoading, isFetching, isFetched, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: ({ signal }) => getUser(signal),
        onSuccess: (received) => {
            if (!received) {
                clearStoredUser();
            } else {
                setStoredUser(received);
            }
        },
        onError: (err) => {
            console.log(err);
            clearUser();
        },
    });


    // meant to be called from useAuth
    function updateUser(newUser) {
        // update the user
        queryClient.setQueryData(["user"], newUser);
    }

    // meant to be called from useAuth
    function clearUser() {
        // reset user to null
        queryClient.setQueryData(["user"], null);
        queryClient.clear();
        clearStoredUser();
    }

    async function addPushToken(token) {
        let user = await AsyncStorage.getItem("nasya_user");
        if (!user) {
            // Logout the user
            return null;
        }
        const body = {
            pushToken: token,
        };

        const { data } = await axiosInstancee.put("/auth/push-token", body, {
            headers: getJWTHeader(JSON.parse(user)),
        });
        return data;
    }

    // async function addPushToken(token) {

    //   queryClient.setQueryData(
    //     ['user'],
    //     (oldData) => oldData ? {
    //       ...oldData,
    //       push_token: token
    //     } : oldData
    //   )
    // }

    return {
        user,
        isLoading,
        isFetching,
        isFetched,
        refetchUser: refetch,
        updateUser,
        clearUser,
        addPushToken,
    };
};