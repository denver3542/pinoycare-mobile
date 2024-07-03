import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

async function getDashboardData() {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const { data } = await axiosInstance.get(`/dashboard`, {
      headers,
      "Content-Type": "application/json;charset=utf-8",
    });
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function deleteDashboardData() {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const { data } = await axiosInstance.delete(`/user/delete-dashboard`, {
      headers,
      "Content-Type": "application/json;charset=utf-8",
    });
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function useDashboard() {
  const queryClient = useQueryClient();

  const query = useQuery(["dashboard"], () => getDashboardData());

  const mutation = useMutation(deleteDashboardData, {
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard"]);
    },
  });

  return {
    ...query,
    deleteDashboard: mutation.mutate,
    deleteDashboardStatus: mutation.status,
  };
}
