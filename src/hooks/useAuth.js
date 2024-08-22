import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import { useUser } from "./useUser";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { setStoredUser } from "../user-storage";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AuthSession from "expo-auth-session";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  androidClientId:
    "1052234263699-85n1ot28d05svoo6k9em0dm89ut2abi3.apps.googleusercontent.com",
  iosClientId:
    "1052234263699-60th2744n696g8md6pid4ocoqj8irvgd.apps.googleusercontent.com",
  expoClientId:
    "1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com",
  webClientId:
    "1052234263699-ttdsak4ukns3og6gp39984oth3rhl5f4.apps.googleusercontent.com",
};

const facebookConfig = {
  androidClientId: "481189014291453",
  iosClientId: "481189014291453",
  expoClientId: "481189014291453",
  webClientId: "481189014291453",
};

export function useAuth() {
  const SERVER_ERROR = "There was an error contacting the server.";
  const { clearUser, updateUser } = useUser();
  const navigation = useNavigation();

  const authServerCall = async (urlEndpoint, userDetails) => {
    try {
      const response = await axiosInstance.post(urlEndpoint, userDetails);
      return handleResponse(response.data);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || SERVER_ERROR
        : SERVER_ERROR;
      const errors = axios.isAxiosError(error)
        ? error.response?.data?.errors
        : [];
      return { success: false, message: errorMessage, errors: errors };
    }
  };

  const handleResponse = (data) => {

    console.log("Handle Response Data:", data);
    if (data.user && data.token) {
      setStoredUser(data.user);
      updateUser(data.user);
      return { success: true, user: data.user };
    } else {
      return {
        success: false,
        message: data.message || SERVER_ERROR,
        errors: data.errors || [],
      };
    }
  };


  const login = (userDetails) => authServerCall("/auth/login", userDetails);
  
  const signup = async (userDetails) => {
      const response = await axiosInstance.post("/auth/signup", userDetails);
      return handleSignupResponse(response.data);
  };


  const handleSignupResponse = (data) => {
    console.log("Handle Signup Response Data:", data);

    if (data.success === 1 || data.success === true) {
      return { success: true, user: data.user, message: data.message };
    } else {
      return {
        success: false,
        message: data.message || SERVER_ERROR,
        errors: data.errors || [],
      };
    }
  };


  const verifyOtp = async (otpCode) => {
    const response = await authServerCall("/auth/verify-otp", { otp_code: otpCode });
    return response; };

    const resendOtp = async (email) => {console.log('resendOtp called with email:', email);
            const response = await authServerCall('/auth/resend-otp', { email });
            console.log('resendOtp response:', response);
            return response;
    };



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

      const response = await axiosInstance.delete("/user/delete-account", {
        headers,
      });
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

  const initiatePasswordReset = (email) =>
    authServerCall("/auth/forgot-password", { email });
  const resetPassword = (token, newPassword) =>
    authServerCall("/auth/reset-password", { token, newPassword });

  const [request, googleResponse, googleLoginOrSignup] = Google.useAuthRequest({
    androidClientId: googleConfig.androidClientId,
    iosClientId: googleConfig.iosClientId,
    expoClientId: googleConfig.expoClientId,
    clientId: googleConfig.webClientId,
    // redirectUri: 'com.upcare.mobile:/oauthredirect',
    selectAccount: true,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    async function loginWithGoogle(accessToken) {
      await authServerCall("/auth/google/callback", {
        googleToken: accessToken,
      });
    }

    if (googleResponse?.type === "success") {
      const { access_token } = googleResponse.params;
      loginWithGoogle(access_token);
    }
  }, [googleResponse]);

  const [fbRequest, facebookResponse, facebookLoginOrSignup] =
    Facebook.useAuthRequest({
      androidClientId: facebookConfig.androidClientId,
      iosClientId: facebookConfig.iosClientId,
      expoClientId: facebookConfig.expoClientId,
      clientId: facebookConfig.webClientId,
      selectAccount: true,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });

  useEffect(() => {
    async function loginOrSignUpWithFacebook(accessToken) {
      await authServerCall("/auth/facebook/callback", {
        facebookToken: accessToken,
      });
    }
    if (facebookResponse?.type === "success") {
      const { access_token } = facebookResponse.params;
      loginOrSignUpWithFacebook(access_token);
    }
  });

  const handleAppleSignInOrSignUp = async (credential) =>
    authServerCall("/auth/apple-signin", {
      authorizationCode: credential.authorizationCode,
      identityToken: credential.identityToken,
      user: JSON.stringify({
        email: credential.email,
        fullName: credential.fullName,
      }),
    });

  return {
    login,
    signup,
    verifyOtp,
    resendOtp,
    logout,
    initiatePasswordReset,
    resetPassword,
    deleteUser,
    googleResponse,
    googleLoginOrSignup,
    request,
    facebookResponse,
    facebookLoginOrSignup,
    fbRequest,
    handleAppleSignInOrSignUp,
  };
}
