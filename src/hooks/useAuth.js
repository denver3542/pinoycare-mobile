import React from 'react'
import { useEffect } from 'react'
import * as WebBrowser from "expo-web-browser"
import axios from 'axios';
import axiosInstancee, { getJWTHeader } from '../../utils/axiosConfig';
import { useUser } from './useUser';

WebBrowser.maybeCompleteAuthSession()

export default function useAuth() {
    const SERVER_ERROR = "There was an error contacting the server.";
    const { clearUser, updateUser } = useUser();

    async function authServerCall(urlEndpoint, userDetails) {
        try {
            const { data } = await axiosInstancee({
                url: urlEndpoint,
                method: "POST",
                data: userDetails,
                headers: { "Content-Type": "application/json" },
            });
            if ("user" in data && "token" in data.user) {
                // update stored user data
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

    async function login(userDetails) {
        return authServerCall("/auth/login", userDetails);
    }
    async function signup(userDetails) {
        return authServerCall("/auth/signup", userDetails);
    }

    // async function logout() {
    //     try {
    //         // clear user from stored user data
    //         const storedUser = await AsyncStorage.getItem("nasya_user");
    //         if (storedUser) {
    //              const headers = getJWTHeader(JSON.parse(storedUser));
    //             await axiosInstance.post("/auth/logout", {}, { headers });
    //         }
    //         clearUser();
    //     } catch (err) {
    //         clearUser();
    //         console.log(err);
    //     }
    // }


    return {
        login,
        signup,
        // googleLoginOrSignup,
        // googleResponse,
        // facebookLoginOrSignup,
        // facebookResponse,
        // appleLoginOrRegister,
        // logout,
    };
}
