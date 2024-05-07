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
  const navigation = useNavigation();

  return useMutation(
    async ({ postId, reaction }) => {
      // Optimistically update the UI assuming the reaction has been successfully added
      queryClient.setQueryData(["feeds"], (prevData) => {
        return prevData.map((post) => {
          if (post.id === postId) {
            // Determine the previous and new reactions
            const prevReactions = post.reactions || [];
            const newReactions = reaction ? [...prevReactions, { reaction }] : prevReactions.filter((react) => react.reaction !== reaction);

            return {
              ...post,
              reactions: newReactions,
            };
          }
          return post;
        });
      });

      // Make the actual API call to add the reaction
      return reactToPost(postId, reaction);
    },
    {
      // Rollback the optimistic update on mutation failure
      onError: async (error, variables, context) => {
        const { postId } = context;
        await queryClient.cancelQueries(["feeds"]);

        queryClient.setQueryData(["feeds"], (prevData) => {
          return prevData.map((post) => {
            if (post.id === postId) {
              // Revert to the previous reactions
              return {
                ...post,
                reactions: context.prevReactions,
              };
            }
            return post;
          });
        });
      },
      // Invalidate the feeds query on mutation success
      onSettled: () => {
        queryClient.invalidateQueries("feeds");
      },
      // Context passed to onError to store necessary data for rollback
      onMutate: async ({ postId, reaction }) => {
        const prevData = queryClient.getQueryData(["feeds"]);

        // Store previous reactions for rollback
        const prevReactions = prevData
          .find((post) => post.id === postId)
          .reactions.slice();

        return { postId, prevReactions };
      },
    }
  );
}
