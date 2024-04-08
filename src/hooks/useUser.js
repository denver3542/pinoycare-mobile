import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import { clearStoredUser, setStoredUser } from "../user-storage";

export async function getUser(signal) {
  let user = await AsyncStorage.getItem("upcare_user");
  if (!user) {
    return null;
  }

  const { data } = await axiosInstance.get("/auth", {
    signal,
    headers: getJWTHeader(JSON.parse(user)),
  });

  return data.user;
}

export const useUser = () => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: ({ signal }) => getUser(signal),
    onSuccess: (received) => {
      if (!received) {
        clearStoredUser();
      } else {
        setStoredUser(received);
      }
    },
    onError: (err) => {
      console.log(err);
      clearUser();
    },
  });

  // meant to be called from useAuth
  function updateUser(newUser) {
    // update the user
    queryClient.setQueryData(["user"], newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // reset user to null
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
    clearStoredUser();
  }

  async function addPushToken(token) {
    let user = await AsyncStorage.getItem("upcare_user");
    if (!user) {
      // Logout the user
      return null;
    }
    const body = {
      pushToken: token,
    };

    const { data } = await axiosInstance.put("/auth/push-token", body, {
      headers: getJWTHeader(JSON.parse(user)),
    });
    return data;
  }

  async function verifyUser(signal, userToVerify) {
    // Retrieve the stored user from AsyncStorage
    const storedUser = await AsyncStorage.getItem("upcare_user");

    if (!storedUser) {
      return null;
    }

    // Parse the stored user JSON
    const user = JSON.parse(storedUser);

    // Get JWT headers
    const headers = getJWTHeader(user);

    try {
      // Make a POST request to the submit verification endpoint
      const { data } = await axiosInstance.post("/user/profile/submit-verification", userToVerify, {
        signal,
        headers,
      });

      return data.user;
    } catch (error) {
      console.error("Error verifying user:", error);
      return null; // Return null in case of an error
    }
  }



  return {
    user,
    isLoading,
    isFetching,
    isFetched,
    refetchUser: refetch,
    updateUser,
    clearUser,
    addPushToken,
    verifyUser
  };
};
