import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosConfig";

async function getFeeds(signal) {
  try {
    // if (!user) {
    //   return null;
    // }

    const { data } = await axiosInstance.get("/public/feeds", {
      signal,
      // headers: getJWTHeader(user),
    });

    return data.posts;
  } catch (error) {
    throw error;
  }
}

export default function useFeeds() {
  return useQuery(
    ["feeds"],
    async () => {
      // const user = await AsyncStorage.getItem("upcare_user");
      // return getFeeds(undefined, JSON.parse(user));
      return getFeeds(undefined);
    },
    {
      retry: false,
      onError: (error) => {
        console.error("Error fetching feeds:", error);
      },
    }
  );
}

export function useReactToPost() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutate } = useMutation(
    async ({ postId, reaction }) => {
      try {
        const storedUser = await AsyncStorage.getItem("upcare_user");
        const headers = getJWTHeader(JSON.parse(storedUser));

        const { data } = await axiosInstance.post(
          "/user/reacts",
          {
            post_id: postId,
            reaction: reaction,
            user_id: JSON.parse(storedUser).id,
          },
          { headers }
        );
        return data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => { },
      onError: (error) => { },
    }
  );

  return mutate;
}


