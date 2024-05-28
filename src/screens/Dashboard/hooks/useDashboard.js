import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

async function getDashboardData() {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const { data } = await axiosInstance.get(`/dashboard`, {
      headers,
      "Content-Type": "application/json;charset=utf-8",
    });
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export function useDashboard() {
  return useQuery(["dashboard"], () => getDashboardData());
}
