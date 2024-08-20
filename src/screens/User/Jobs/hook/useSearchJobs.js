import { useQuery } from '@tanstack/react-query';
import axiosInstance, { getJWTHeader } from '../../../../../utils/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function searchJobs(searchQuery, signal, user) {
    if (!user) {
        console.warn('No User found in AsyncStorage');
        return [];
    }

    try {
        const response = await axiosInstance.get('/searchJob', {
            signal,
            headers: getJWTHeader(user),
            params: {
                search: searchQuery,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const useSearchJobs = (searchQuery) => {
    return useQuery(
        ['searchJobs', searchQuery],
        async ({ signal }) => {
            const user = await AsyncStorage.getItem('upcare_user');
            if (!user) {
                console.warn('No User found in AsyncStorage');
                return [];
            }
            return searchJobs(searchQuery, signal, JSON.parse(user));
        },
        {
            enabled: !!searchQuery, 
            staleTime: 300000, 
            refetchOnWindowFocus: false, 
        }
    );
};

export default useSearchJobs;
