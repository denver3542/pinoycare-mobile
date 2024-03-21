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

    console.log(data);
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

export default function useMessaging() {
  return useQuery(["inbox"], () => getInbox());
}
