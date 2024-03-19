import { useQuery } from "@tanstack/react-query";
import React from "react";
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getJobsData(signal, user) {
  try {
    if (!user) {
      return null;
    }

    const { data } = await axiosInstance.get("/posted_jobs", {
      signal,
      headers: getJWTHeader(user),
    });

    return data.data;
  } catch (error) {
    throw error;
  }
}

export default function useJobs() {
  return useQuery(
    ["jobs"],
    async () => {
      // Get user data from AsyncStorage
      const user = await AsyncStorage.getItem("upcare_user");

      // Fetch applications with the user data
      return getJobsData(undefined, JSON.parse(user));
    },
    {
      // Configure retry and error handling options
      retry: false, // Disable automatic retry on error
      onError: (error) => {
        // Handle errors (e.g., show toast message)
        console.error("Error fetching jobs:", error);
      },
    }
  );
}