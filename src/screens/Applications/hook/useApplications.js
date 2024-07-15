import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";


async function fetchApplications(signal, user) {
  try {

    if (!user) {
      return null;
    }

    const { data } = await axiosInstance.get("/applications", {
      signal,
      headers: getJWTHeader(user),
    });


    return data.user.applications;
  } catch (error) {

    throw error;
  }
}


export default function useApplications() {

  return useQuery(
    ["applications"],
    async () => {

      const user = await AsyncStorage.getItem("upcare_user");


      return fetchApplications(undefined, JSON.parse(user));
    },
    {
      retry: false,
      onError: (error) => {
        console.error("Error fetching applications:", error);
      },
    }
  );
}
