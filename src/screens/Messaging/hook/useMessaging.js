import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

async function getInbox() {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};

    const { data } = await axiosInstance.get("/user/messages", {
      headers,
      "Content-Type": "application/json;charset=utf-8",
    });

    return data;
  } catch (error) {
    console.error(error.message);
  }
}

async function getConvo(otherUserId) {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};

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

export default function useMessaging() {
  const { data, isFetching, isFetched, isLoading, isRefetching, refetch } =
    useQuery(["inbox"], () => getInbox());

  const sendMessage = async (otherUserId, message) => {
    try {
      const storedUser = await AsyncStorage.getItem("upcare_user");
      const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};

      const { data } = await axiosInstance.post(
        `/user/send-message`,
        { to_user_id: otherUserId, message: message },
        {
          headers,
          "Content-Type": "application/json;charset=utf-8",
        }
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    data,
    isFetching,
    isFetched,
    isLoading,
    isRefetching,
    refetch,
    sendMessage,
  };
}

export function useConvo(otherUserId) {
  return useQuery([`convo_${otherUserId}`], () => getConvo(otherUserId));
}

export function sendMessage(otherUserId, message) {}
