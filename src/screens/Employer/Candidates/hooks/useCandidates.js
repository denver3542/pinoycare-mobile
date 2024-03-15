import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";

async function getCandidates(signal, user) {
  try {
    // If user is not available, return null
    if (!user) {
      return null;
    }

    // Fetch applications using axiosInstance
    const { data } = await axiosInstance.get("/applicants", {
      signal,
      headers: getJWTHeader(user),
    });

    // Return applications
    return data.candidates;
  } catch (error) {
    // Throw the error to be caught by React Query
    throw error;
  }
}

export default function useCandidates() {
  return useQuery(
    ["candidates"],
    async () => {
      // Get user data from AsyncStorage
      const user = await AsyncStorage.getItem("upcare_user");

      // Fetch applications with the user data
      return getCandidates(undefined, JSON.parse(user));
    },
    {
      // Configure retry and error handling options
      retry: false, // Disable automatic retry on error
      onError: (error) => {
        // Handle errors (e.g., show toast message)
        console.error("Error fetching candidates:", error);
      },
    }
  );
}
