import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../utils/axiosConfig";
import { clearStoredUser, setStoredUser } from "../user-storage";
import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import axios from "axios";

async function getUser(signal) {
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

const fetchLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }

  let location = await Location.getCurrentPositionAsync({});
  let reverseGeocode = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  let city = reverseGeocode[0].city;
  return city;
};

const updateLocationOnServer = async (city) => {
  const storedUser = await AsyncStorage.getItem("upcare_user");
  if (!storedUser) {
    throw new Error("User not logged in");
  }

  const user = JSON.parse(storedUser);
  const headers = getJWTHeader(user);

  try {
    const response = await axiosInstance.put(
      "/user/update/location",
      { city },
      { headers }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update location on server");
  }
};

const deleteResource = async (url, idField, id) => {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};

    const response = await axiosInstance.delete(url, {
      headers,
      data: { [idField]: id },
    });

    if (response.status !== 200) {
      throw new Error("Failed to delete resource");
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const useUser = () => {
  const queryClient = useQueryClient();
  const [city, setCity] = useState(null);
  const [cityFetched, setCityFetched] = useState(false);
  const locationUpdateRef = useRef(false);
  const SERVER_ERROR = "There was an error contacting the server.";

  const {
    data: user,
    isLoading: userLoading,
    isFetching,
    isFetched,
    refetch: refetchUser,
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

  useQuery({
    queryKey: ["city"],
    queryFn: fetchLocation,
    enabled: !!user && !cityFetched,
    onSuccess: (fetchedCity) => {
      if (!cityFetched) {
        setCity(fetchedCity);
        setCityFetched(true);
        // console.log("City fetched:", fetchedCity);
      } else {
        // console.log("City was already fetched.");
      }
    },
    onError: (error) => {
      console.error("Failed to fetch location:", error);
    },
  });

  const { mutate: updateLocation } = useMutation(updateLocationOnServer, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      console.error("Failed to update user location:", error);
    },
  });

  useEffect(() => {
    if (city && cityFetched) {
      updateLocation(city);
      locationUpdateRef.current = true;
    }
  }, [city, cityFetched, updateLocation]);

  const isAuthenticated = !!user;

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
            type: "image/jpeg",
            name: `image_${index}.jpg`,
          });
        }
      });

      const { data } = await axiosInstance.post(
        "/user/profile/submit-verification",
        images,
        {
          headers,
          formData,
        }
      );
      return data.user;
    } catch (error) {
      console.error("Error verifying user:", error);
      return null;
    }
  }

  const deleteSkill = useMutation({
    mutationFn: (skillsId) =>
      deleteResource("/user/profile/delete-skills", "skill_id", skillsId),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      console.error("Error deleting skill:", error);
    },
  });

  const deleteEducation = useMutation({
    mutationFn: (educationId) =>
      deleteResource(
        "/user/profile/delete-educations",
        "education_id",
        educationId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const deleteTraining = useMutation({
    mutationFn: (trainingId) =>
      deleteResource(
        "/user/profile/delete-trainings",
        "trainings_id",
        trainingId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      console.log("Training deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting training:", error);
    },
  });

  const deleteExperience = useMutation({
    mutationFn: (experienceId) =>
      deleteResource(
        "/user/profile/delete-experience",
        "experience_id",
        experienceId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      console.log("Experience deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting experience:", error);
    },
  });

  const linkAppleAccount = async (credential) => {
    try {
      const storedUser = await AsyncStorage.getItem("upcare_user");
      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);
      const headers = getJWTHeader(user);

      const response = await axiosInstance.post(
        "/auth/link-apple-account",
        {
          authorizationCode: credential.authorizationCode,
          identityToken: credential.identityToken,
          user: JSON.stringify({
            email: credential.email,
            fullName: credential.fullName,
          }),
        },
        {
          headers: getJWTHeader(user),
        }
      );

      if (response.data.status === "success") {
        queryClient.invalidateQueries(["user"]);
        return { success: true, message: "Apple account linked successfully." };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || SERVER_ERROR
        : SERVER_ERROR;
      return { success: false, message: errorMessage };
    }
  };

  return {
    user,
    isAuthenticated,
    userLoading,
    isFetching,
    isFetched,
    refetchUser,
    updateUser,
    clearUser,
    addPushToken,
    verifyUser,
    city,
    cityFetched,
    deleteSkill: deleteSkill.mutate,
    deleteEducation: deleteEducation.mutate,
    deleteTraining: deleteTraining.mutate,
    deleteExperience: deleteExperience.mutate,
    linkAppleAccount,
  };
};
