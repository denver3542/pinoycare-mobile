import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

async function getJobData(job_id) {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const { data } = await axiosInstance.get(`/job/${job_id}`, { headers });

    return data.job;
  } catch (err) {
    console.log(err);
  }
}

export default function useJob(job_id) {
  const { data, isFetching, isFetched } = useQuery([`job_${job_id}`], () =>
    getJobData(job_id)
  );

  function getQuestions() {}

  return {
    data,
    isFetching,
    isFetched,
  };
}
