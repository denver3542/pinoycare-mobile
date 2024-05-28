import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";
import axios from "axios";

async function getJobData(job_id) {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const { data } = await axiosInstance.get(`/job/${job_id}`, { headers });

    console.log(data);
    return data.job;
  } catch (err) {
    console.log(err);
  }
}

export default function useJob(job_id) {
  const { data, isFetching, isFetched, refetch, isRefetching } = useQuery(
    [`job_${job_id}`],
    () => getJobData(job_id)
  );

  return {
    data,
    isFetching,
    isFetched,
    refetch,
    isRefetching,
  };
}

export async function submitApplication(inputData) {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const res = await axiosInstance.post(`/application/store`, inputData, {
      headers,
    });

    return res;
  } catch (error) {
    console.log(error);
    let errorMessage = "Server error";
    let errors = [];
    if (axios.isAxiosError(error)) {
      errorMessage = error.response.data.message || errorMessage;
      errors = error.response.data.error;
    }
    return { success: 0, message: errorMessage, errors: errors };
  }
}
