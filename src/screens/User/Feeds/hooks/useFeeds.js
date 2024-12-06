import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";
import { useNavigation } from "@react-navigation/native";

async function getFeeds(signal, user) {
  try {
    if (!user) {
      return null;
    }

    const { data } = await axiosInstance.get("/feeds", {
      signal,
      headers: getJWTHeader(user),
    });

    return data.posts;
  } catch (error) {
    throw error;
  }
}

export default function useFeeds() {
  const queryClient = useQueryClient();

  return useQuery(
    ["feeds"],
    async () => {
      const user = await AsyncStorage.getItem("upcare_user");
      return getFeeds(undefined, JSON.parse(user));
    },
    {
      retry: false,
      onError: (error) => {
        console.error("Error fetching feeds:", error);
      },
    }
  );
}

async function reactToPost(postId, reaction) {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = getJWTHeader(JSON.parse(storedUser));

    const { data } = await axiosInstance.post(
      "/user/reacts",
      {
        post_id: postId,
        reaction: reaction,
      },
      { headers }
    );


    if (data.User) {
      return data.User;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export function useReactToPost() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId, reaction }) => {
      return reactToPost(postId, reaction);
    },
    {
      onMutate: async ({ postId, reaction }) => {
        const user = JSON.parse(await AsyncStorage.getItem("upcare_user"));
        const userId = user.id;
       
        const prevData = queryClient.getQueryData(["feeds"]);
       
        queryClient.setQueryData(["feeds"], (oldFeeds) =>
          oldFeeds.map((post) => {
            if (post.id === postId) {
              const prevReactions = post.reactions || [];
              const newReactions = reaction
                ? [...prevReactions, { user_id: userId, reaction }]
                : prevReactions.filter(
                    (react) => !(react.user_id === userId && react.reaction === "love")
                  );
              return { ...post, reactions: newReactions };
            }
            return post;
          })
        );
       
        return { prevData };
      },
      onError: (error, { postId }, context) => {
        queryClient.setQueryData(["feeds"], context.prevData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["feeds"]);
      },
      onSuccess: (updatedPost) => {
        queryClient.setQueryData(["feeds"], (oldFeeds) =>
          oldFeeds.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
      },
    }
  );
}

