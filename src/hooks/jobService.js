import { useEffect, useState } from 'react';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import { useUser } from '../hooks/useUser';

export function useJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser(); // Use the useUser hook to get the user token

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                if (!user) {
                    // If no user token, set loading to false and return
                    setLoading(false);
                    return;
                }

                console.log('User exists:', user);

                // Get JWT header for the user token
                const headers = getJWTHeader(user);
                console.log('Headers:', headers);

                // Fetch jobs data from the API
                const response = await axiosInstance.get("auth/jobs", { headers });

                // Set jobs state with fetched data
                setJobs(response.data.jobs);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                if (error.response && error.response.status === 401) {
                    console.log("Token expired. Please log in again.");
                    setError("Authentication failed. Please log in again.");
                } else {
                    setError("Error fetching jobs. Please try again.");
                }
                setLoading(false);
            }
        };

        // Call fetchJobs function when component mounts
        fetchJobs();

        // Clean up function
        return () => {
            // Cleanup code (if needed)
        };
    }, [user]); // Include user in the dependency array

    return { jobs, loading, error };
}
