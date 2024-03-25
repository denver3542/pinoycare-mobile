// hooks/useFeeds.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import React from "react";
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
