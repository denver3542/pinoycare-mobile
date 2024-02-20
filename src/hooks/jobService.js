import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';

export function useJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("upcare_user");
                if (!storedUser) {
                    setLoading(false); // Set loading to false when user is not found
                    return;
                }
                const user = JSON.parse(storedUser);

                const response = await axiosInstance.get("/jobs", {
                    headers: getJWTHeader(user)
                });

                console.log("Fetched jobs:", response.data); // Log fetched jobs

                if (response.data.success) {
                    setJobs(response.data.jobs); // Assuming jobs data is nested under the 'jobs' key
                } else {
                    // Handle the case when the request is successful but jobs data is not available
                    console.log("No jobs data available");
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setError("Error fetching jobs. Please try again."); // Set a generic error message
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return { jobs, loading, error };
}
