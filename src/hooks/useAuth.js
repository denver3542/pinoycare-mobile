import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import { useUser } from "./useUser";
import { Alert } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { setStoredUser } from "../user-storage";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  androidClientId: '1052234263699-85n1ot28d05svoo6k9em0dm89ut2abi3.apps.googleusercontent.com',
  iosClientId: '1052234263699-60th2744n696g8md6pid4ocoqj8irvgd.apps.googleusercontent.com',
  expoClientId: '1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com',
  webClientId: '1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com',

};

export function useAuth() {
  const SERVER_ERROR = "There was an error contacting the server.";
  const { clearUser, updateUser } = useUser();
  const navigation = useNavigation();


  // Centralized server call
  const authServerCall = async (urlEndpoint, userDetails) => {
    try {
      const response = await axiosInstance.post(urlEndpoint, userDetails);
      return handleResponse(response.data);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? (error.response?.data?.message || SERVER_ERROR) : SERVER_ERROR;
      const errors = axios.isAxiosError(error) ? error.response?.data?.errors : [];
      return { success: false, message: errorMessage, errors: errors };
    }
  };

  // Handle responses from the server
  const handleResponse = (data) => {
    if (data.user && data.token) {
      setStoredUser(data.user);
      updateUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || SERVER_ERROR, errors: data.errors };
    }
  };

  // User authentication functions
  const login = (userDetails) => authServerCall("/auth/login", userDetails);
  const signup = (userDetails) => authServerCall("/auth/signup", userDetails);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("upcare_user");
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      clearUser();
    }
  };

  const deleteUser = async () => {
    try {
      const user = await AsyncStorage.getItem("upcare_user");
      if (!user) return { success: false, message: "User not authenticated" };

      const parsedUser = JSON.parse(user);
      const headers = getJWTHeader(parsedUser);

      const response = await axiosInstance.delete("/user/delete-account", { headers });
      if (response.data.success) {
        clearUser();
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      return { success: false, message: "Error deleting user account" };
    }
  };

  const initiatePasswordReset = (email) => authServerCall("/auth/forgot-password", { email });
  const resetPassword = (token, newPassword) => authServerCall("/auth/reset-password", { token, newPassword });


  const [request, googleResponse, googleLoginOrSignup] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    expoClientId: googleConfig.expoClientId,
    clientId: googleConfig.webClientId,
    // redirectUri: 'com.upcare.mobile:/oauthredirect',
    selectAccount: true,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    async function loginWithGoogle(accessToken) {
      await authServerCall("/auth/google/callback", { googleToken: accessToken });
    }

    if (googleResponse?.type === "success") {
      const { access_token } = googleResponse.params;
      loginWithGoogle(access_token);
    }
  }, [googleResponse]);

  return {
    login,
    signup,
    logout,
    initiatePasswordReset,
    resetPassword,
    deleteUser,
    googleResponse,
    googleLoginOrSignup,
    request,
  };
}
