import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosConfig";

async function getFeeds(signal) {
  try {
    const { data } = await axiosInstance.get("/public/feeds", {
      signal,
    });
    return data.posts;
  } catch (error) {
    throw error;
  }
}

export default function useFeeds() {
  return useQuery(
    ["feeds"],
    async () => {
      return getFeeds(undefined);
    },
    {
      retry: false,
      onError: (error) => {
        console.error("Error fetching feeds:", error);
      },
    }
  );
}
