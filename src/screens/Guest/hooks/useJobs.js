import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import axiosInstance from "../../../../utils/axiosConfig";

async function getJobs() {
  try {
    const { data } = await axiosInstance.get("/public/jobs");

    return data.jobs;
  } catch (error) {
    throw error;
  }
}

export default function useJobs() {
  return useQuery(["jobs"], () => getJobs());
}
