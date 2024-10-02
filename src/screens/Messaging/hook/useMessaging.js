import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import React from "react";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

// Fetch inbox messages (unchanged)
async function getInbox() {
  const storedUser = await AsyncStorage.getItem("upcare_user");
  const headers = {
    ...getJWTHeader(JSON.parse(storedUser)),
    "Content-Type": "multipart/form-data",
  };

  try {
    const { data } = await axiosInstance.get("/user/messages", {
      headers,
    });
    return data;
  } catch (error) {
    console.error("Error fetching inbox:", error.message);
    throw new Error("Failed to fetch inbox");
  }
}

// Fetch conversation (unchanged)
async function getConvo(otherUserId) {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = {
      ...getJWTHeader(JSON.parse(storedUser)),
      "Content-Type": "multipart/form-data",
    };

    const { data } = await axiosInstance.get(
      `/user/conversation/${otherUserId}`,
      {
        headers,
        "Content-Type": "application/json;charset=utf-8",
      }
    );

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Custom hook using `useMutation` for sending a message
export default function useMessaging() {
  // For inbox fetching, still using useQuery
  const { data, isFetching, isFetched, isLoading, isRefetching, refetch } =
    useQuery(["inbox"], getInbox);

  const mutation = useMutation(
    async (formData) => {
      console.log("Attempting to send message...");
      try {
        const storedUser = await AsyncStorage.getItem("upcare_user");
        if (!storedUser) {
          console.error("No user data found in storage. Cannot send message.");
          throw new Error("User not authenticated");
        }

        const headers = {
          ...getJWTHeader(JSON.parse(storedUser)),
          "Content-Type": "multipart/form-data",
        };

        const response = await axiosInstance.post(`/user/send-message`, formData, {
          headers,
        });

        if (response.status === 200) {
          console.log("Message sent successfully, server response:", response.data);
          return response.data.success;
        } else {
          throw new Error(`Failed to send message with status: ${response.status}`);
        }
      } catch (error) {
        if (error.response) {
          console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
          console.error("Request made but no response received:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
        throw new Error("Failed to send message");
      }
    }
  );

  return {
    data,
    isFetching,
    isFetched,
    isLoading,
    isRefetching,
    refetch,
    send: mutation.mutateAsync, // Call mutation's async mutate function to send a message
  };
}

// Fetching specific conversation (unchanged)
export function useConvo(otherUserId) {
  return useQuery([`convo_${otherUserId}`], () => getConvo(otherUserId));
}
