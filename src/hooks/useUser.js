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

  function updateUser(newUser) {
    queryClient.setQueryData(["user"], newUser);
  }

  function clearUser() {
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
    clearStoredUser();
  }

  async function addPushToken(token) {
    let user = await AsyncStorage.getItem("upcare_user");
    if (!user) {
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

  async function verifyUser(images) {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);
    const headers = getJWTHeader(user);

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        if (image.uri) {
          formData.append(`image[${index}]`, {
            uri: image.uri,
            type: 'image/jpeg',
            name: `image_${index}.jpg`,
          });
        }
      });

      const { data } = await axiosInstance.post("/user/profile/submit-verification", images, {
        headers,
        formData,
      });
      return data.user;
    } catch (error) {
      console.error("Error verifying user:", error);
      return null;
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
