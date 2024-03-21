import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../utils/axiosConfig";
import { useUser } from "./useUser";
import axios from "axios";
import { setStoredUser } from "../user-storage";

export default function useAuth() {
  const SERVER_ERROR = "There was an error contacting the server.";
  const { clearUser, updateUser } = useUser();

  // Utility function to handle responses
  const handleResponse = (data) => {
    if ("user" in data && "token" in data) {
      setStoredUser(data.user);
      updateUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { success: 0, message: data.message, errors: data.errors };
    }
  };

  // Centralize server calls
  async function authServerCall(urlEndpoint, userDetails) {
    try {
      const response = await axiosInstance.post(urlEndpoint, userDetails);
      return handleResponse(response.data);
    } catch (error) {
      let errorMessage = SERVER_ERROR;
      let errors = [];
      if (axios.isAxiosError(error)) {
        errorMessage = error.response.data.message || errorMessage;
        errors = error.response.data.errors;
      }
      return { success: 0, message: errorMessage, errors: errors };
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

  // Function to log out user
  async function logout() {
    try {
      await AsyncStorage.removeItem("upcare_user");
      clearUser();
    } catch (err) {
      // Handle error if any during the logout process
      clearUser(); // Ensuring user state is cleared even if there's an error
      // Log error or handle it if needed
    }
  }

  // Function to initiate password reset
  async function initiatePasswordReset(email) {
    return authServerCall("/auth/forgot-password", { email });
  }

  // Function to complete password reset
  async function resetPassword(token, newPassword) {
    return authServerCall("/auth/reset-password", { token, newPassword });
  }

  return {
    login,
    signup,
    logout,
    initiatePasswordReset,
    resetPassword,
  };
}
