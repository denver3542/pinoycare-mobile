import { useEffect, useState } from 'react';
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import { useUser } from '../hooks/useUser';

export function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user) {
                    setLoading(false);
                    return;
                }
                const headers = getJWTHeader(user);
                const response = await axiosInstance.get("/auth/profile", { headers });
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
    }, [user]);

    return { profile, loading, error };
}
