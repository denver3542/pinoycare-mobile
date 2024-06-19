import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../utils/axiosConfig";
import { useUser } from "./useUser";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from "react";
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

WebBrowser.maybeCompleteAuthSession();

const config = {
  androidClientId: '1052234263699-85n1ot28d05svoo6k9em0dm89ut2abi3.apps.googleusercontent.com',
  iosClientId: '1052234263699-60th2744n696g8md6pid4ocoqj8irvgd.apps.googleusercontent.com',
  expoClientId: '1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com',
  redirectUri: 'com.upcare.mobile:/oauthredirect'
};

export default function useAuth() {
  const SERVER_ERROR = "There was an error contacting the server.";
  const { clearUser, updateUser } = useUser();
  const navigation = useNavigation(); // Initialize navigation hook

  // Google Auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.androidClientId,
    iosClientId: config.iosClientId,
    expoClientId: config.expoClientId,
    redirectUri: config.redirectUri,
    prompt: 'select_account'
  });

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    }
  }, [response]);

  // Handle sign-in or sign-up with Google
  const handleGoogleResponse = async (response) => {
    const { authentication } = response;

    if (authentication?.accessToken) {
      const loginResponse = await loginWithGoogle(authentication.accessToken);

      if (loginResponse.success) {
        updateUser(loginResponse.user);
        // Navigate to Dashboard screen upon successful login
        navigation.navigate('Dashboard');
      } else {
        console.error("Google Login failed", loginResponse.message);
      }
    } else {
      console.error('Access token not found in Google authentication response.');
    }
  };

  // Utility function to handle server responses
  const handleResponse = (data) => {
    if ("user" in data && "token" in data) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || SERVER_ERROR, errors: data.errors || [] };
    }
  };

  // Centralized function for server requests
  async function authServerCall(urlEndpoint, userDetails) {
    try {
      const response = await axiosInstance.post(urlEndpoint, userDetails);
      return handleResponse(response.data);
    } catch (error) {
      let errorMessage = SERVER_ERROR;
      let errors = [];
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
        errors = error.response?.data?.errors || [];
      }
      return { success: false, message: errorMessage, errors: errors };
    }
  }

  // Function to log in user with Google token
  async function loginWithGoogle(googleToken) {
    try {
      const response = await authServerCall("/auth/login/google", { googleToken });
      return response; // Assuming response structure matches handleResponse
    } catch (error) {
      let errorMessage = SERVER_ERROR;
      let errors = [];
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
        errors = error.response?.data?.errors || [];
      }
      return { success: false, message: errorMessage, errors: errors };
    }
  }

  // Function to log in user
  async function login(userDetails) {
    return authServerCall("/auth/login", userDetails);
  }

  // Function to sign up user
  async function signup(userDetails) {
    return authServerCall("/auth/signup", userDetails);
  }

  // Function to delete user account
  async function deleteUser() {
    try {
      const response = await axiosInstance.delete("/user/delete-account", {
        headers: getJWTHeader()
      });

      if (response.data.success) {
        clearUser();
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message || SERVER_ERROR };
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      return { success: false, message: "Error deleting user account" };
    }
  }

  return {
    login,
    signup,
    deleteUser,
    promptAsync,
    request,
  };
}
