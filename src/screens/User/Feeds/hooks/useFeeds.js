import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";

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

export function useReactToPost() {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, reaction }) => {
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
        },
        {
            onSuccess: (data, variables) => {
                // Update the local cache with the new reaction data
                queryClient.setQueryData(["feeds"], (prevData) => {
                    // Find the post with postId and update its reactions
                    const updatedPosts = prevData.map((post) => {
                        if (post.id === variables.postId) {
                            // Assuming the response includes the updated reactions
                            post.reactions = data.reactions;
                        }
                        return post;
                    });
                    return updatedPosts;
                });
            },
            onError: (error) => {
                console.error("Error reacting to post:", error);
            },
        }
    );
}