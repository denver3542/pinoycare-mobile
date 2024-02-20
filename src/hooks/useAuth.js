// Import necessary modules
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import { useUser } from './useUser';
import { setStoredUser } from '../user-storage';

// Define the useAuth hook
export default function useAuth() {
    const SERVER_ERROR = "There was an error contacting the server.";
    const { clearUser, updateUser } = useUser();

    // Define the authentication function that handles server calls
    async function authServerCall(urlEndpoint, userDetails) {
        try {
            const { data } = await axiosInstance({
                url: urlEndpoint,
                method: "POST",
                data: userDetails,
                headers: { "Content-Type": "application/json" },
            });
            console.log('Auth response data:', data);

            if ("user" in data && "token" in data) {
                console.log('Token found in headers:', data.token);
                console.log('Token found, updating user data');
                setStoredUser(data.user);
                updateUser(data.user);
            }

            return data;
        } catch (errorResponse) {
            const title =
                axios.isAxiosError(errorResponse) &&
                    errorResponse?.response?.data?.message
                    ? errorResponse?.response?.data?.message
                    : SERVER_ERROR;
            console.log({ errorResponse, title });
        }
    }

    // Define login, signup, and logout functions
    async function login(userDetails) {
        return authServerCall("/auth/login", userDetails);
    }
    async function signup(userDetails) {
        return authServerCall("/auth/signup", userDetails);
    }
    async function logout() {
        try {
            // clear user from stored user data
            await AsyncStorage.removeItem("upcare_user");
            clearUser();
        } catch (err) {
            clearUser();
            console.log(err);
        }
    }

    // Return the authentication functions
    return {
        login,
        signup,
        logout,
    };
}
