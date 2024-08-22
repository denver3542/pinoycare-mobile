import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

async function getNotifications() {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};

    const { data } = await axiosInstance.get(`/user/notifications`, {
      headers,
    });

    return data;
  } catch (error) {}
}

export default function useNotification() {
  const { data, isFetched, isFetching, isRefetching, refetch } = useQuery(
    ["notifications"],
    () => getNotifications()
  );

  const markAsRead = async (notifId) => {
    try {
      const storedUser = await AsyncStorage.getItem("upcare_user");
      const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
      const { data } = await axiosInstance.post(
        `/user/notifications/${notifId}/mark-as-read`,
        {},
        {
          headers,
        }
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, isFetched, isFetching, isRefetching, refetch, markAsRead };
}
