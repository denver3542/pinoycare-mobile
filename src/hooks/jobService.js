// jobService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import { useUser } from '../hooks/useUser';

async function fetchJobs(setJobs, setLoading, setError, user) {
    try {
        if (!user) {
            setLoading(false);
            return;
        }

        const storedUser = await AsyncStorage.getItem("upcare_user");
        console.log('Stored user:', storedUser);

        if (!storedUser) {
            console.log('No user data found. Please login.');
            setLoading(false);
            return;
        }

        const userData = JSON.parse(storedUser);
        const headers = getJWTHeader(userData);

        console.log('Headers:', headers);

        const { data } = await axiosInstance.get("/jobs", { headers });
        console.log('Jobs data:', data);

        setJobs(data.jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Error fetching jobs. Please try again.");
    } finally {
        setLoading(false);
    }
}

export function useJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        fetchJobs(setJobs, setLoading, setError, user);
    }, [user]);

    return { jobs, loading, error };
}
