import { useEffect, useState } from 'react';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';

export function useProfile(token) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!token) {
                    setLoading(false);
                    return;
                }
                const headers = getJWTHeader(token);
                const response = await axiosInstance.get("/auth/profile", { headers });
                console.log('Profile Data:', response.data); // Log the profile data
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                if (error.response && error.response.status === 401) {
                    console.log("Token expired. Please log in again.");
                    setError("Authentication failed. Please log in again.");
                } else {
                    setError("Error fetching profile. Please try again.");
                }
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    return { profile, loading, error };
}