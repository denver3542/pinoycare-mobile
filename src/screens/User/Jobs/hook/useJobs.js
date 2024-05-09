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
      if (!user) throw new Error("User session not found.");

      return await saveJob(jobId, user);
    },
    {
      onSuccess: () => {

        queryClient.invalidateQueries('savedJobs');
      },
      onError: (error) => {
        console.error("Failed to save job:", error);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['user']);
      },
    }
  );
}

// async function saveJob(jobId, user) {
//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (!jobId) {
//     throw new Error("Job ID is required");
//   }

//   try {
//     const headers = getJWTHeader(user);
//     const { data } = await axiosInstance.post("/job/save", { job_id: jobId }, { headers });

//     if (!data.user) {
//       throw new Error("No user found in server response");
//     }

//     return data;
//   } catch (error) {
//     if (error.response && error.response.status === 422) {
//       throw new Error("Failed to save job: " + JSON.stringify(error.response.data));
//     } else {
//       throw new Error("Failed to save job: " + error.message);
//     }
//   }
// }

// export const useSaveJob = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     async (jobId) => {
//       try {
//         const userStr = await AsyncStorage.getItem("upcare_user");
//         const user = userStr ? JSON.parse(userStr) : null;

//         return await saveJob(jobId, user);
//       } catch (error) {
//         throw new Error("Failed to save job: " + error.message);
//       }
//     },
//     {
//       onSuccess: (data) => {
//         if (data) {
//           queryClient.setQueryData(['user'], data);
//         }
//       },
//       onError: (error) => {
//         console.error("Failed to save job:", error);
//       },
//       onSettled: () => {
//         queryClient.invalidateQueries(['user']);
//       },
//     }
//   );
// };
