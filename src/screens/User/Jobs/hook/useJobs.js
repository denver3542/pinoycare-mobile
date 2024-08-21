import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React from "react";
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";

async function getJobs(signal, user) {
  if (!user) {
    console.warn("No user found in AsyncStorage");
    return [];
  }

  try {
    const { data } = await axiosInstance.get("/jobs", {
      signal,
      headers: getJWTHeader(user),
    });

    return data.jobs || [];
  } catch (error) {
    throw error;
  }
}


export default function useJobs() {
  return useQuery(
    ["jobs"],
    async () => {

      const user = await AsyncStorage.getItem("upcare_user");


      return getJobs(undefined, JSON.parse(user));
    },
    {
      retry: false,
      // refetchOnWindowFocus: true,
      onError: (error) => {
        console.error("Error fetching jobs:", error);
      },
    }
  );
}


async function saveJob(jobId, user) {
  if (!user) {
    throw new Error("User not found");
  }

  const headers = getJWTHeader(user);
  try {
    const { data } = await axiosInstance.post("/job/save", { job_id: jobId }, { headers });
    return data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    throw new Error(`Failed to save job: ${errorMsg}`);
  }
}

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (jobId) => {
      const userStr = await AsyncStorage.getItem("upcare_user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        throw new Error("User session not found.");
      }

      return await saveJob(jobId, user);
    },
    {
      onSuccess: (data, jobId) => {
        queryClient.invalidateQueries('jobs'); // Invalidate jobs list after saving a job
        // Assuming 'savedJobs' is the correct key for the list of saved jobs
        queryClient.invalidateQueries('savedJobs'); // Invalidate saved jobs list
      },
      onError: (error) => {
        console.error("Failed to save job:", error);
      },
      onSettled: (data, error, jobId) => {
        queryClient.invalidateQueries(['user']); // Invalidate user query after any mutation
      },
    }
  );
}

