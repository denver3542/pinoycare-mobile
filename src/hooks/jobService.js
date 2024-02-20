import { useEffect, useState } from 'react';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import { useUser } from '../hooks/useUser';

export function useJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                if (!user) {
                    setLoading(false);
                    return;
                }
                const headers = getJWTHeader(user);
                const response = await axiosInstance.get("auth/jobs", { headers });
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

        fetchJobs();
    }, [user]);

    return { jobs, loading, error }; // Moved return statement outside of useEffect
}
