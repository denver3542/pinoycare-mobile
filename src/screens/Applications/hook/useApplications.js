import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

// Define a function to fetch applications
async function fetchApplications(signal, user) {
  try {
    // If user is not available, return null
    if (!user) {
      return null;
    }

    // Fetch applications using axiosInstance
    const { data } = await axiosInstance.get("/applications", {
      signal,
      headers: getJWTHeader(user),
    });

    // Return applications
    return data.user.applications;
  } catch (error) {
    // Throw the error to be caught by React Query
    throw error;
  }
}

// Define a custom hook to fetch applications using React Query
export default function useApplications() {
  // Use React Query's useQuery hook to fetch applications
  return useQuery(
    ["applications"],
    async () => {
      // Get user data from AsyncStorage
      const user = await AsyncStorage.getItem("upcare_user");

      // Fetch applications with the user data
      return fetchApplications(undefined, JSON.parse(user));
    },
    {
      // Configure retry and error handling options
      retry: false, // Disable automatic retry on error
      onError: (error) => {
        // Handle errors (e.g., show toast message)
        console.error("Error fetching applications:", error);
      },
    }
  );
}
