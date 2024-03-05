import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, { getJWTHeader } from '../../utils/axiosConfig';
import { useUser } from './useUser';
import { setStoredUser } from '../user-storage';

export default function useAuth() {
    const SERVER_ERROR = "There was an error contacting the server.";
    const { clearUser, updateUser } = useUser();

    async function authServerCall(urlEndpoint, userDetails) {
        try {
            console.log('Sending request to:', urlEndpoint);
            console.log('Request data:', userDetails);

            const { data } = await axiosInstance({
                url: urlEndpoint,
                method: "POST",
                data: userDetails,
                headers: { "Content-Type": "application/json" },
            });

            console.log('Auth response data:', data);

            if ("user" in data && "token" in data) {
                console.log('Token found in headers:', data.token);
                console.log('Token found, updating user data');

                const profilePicture = data.user.profile_picture || null;
                const updatedUser = { ...data.user, profile_picture: profilePicture };

                setStoredUser(updatedUser);
                updateUser(updatedUser);
            }

            return data;
        } catch (errorResponse) {
            console.error('Error occurred while making request:', errorResponse);

            const title =
                axios.isAxiosError(errorResponse) &&
                    errorResponse?.response?.data?.message
                    ? errorResponse?.response?.data?.message
                    : SERVER_ERROR;
            console.log('Error title:', title);

            return null; // Return null or handle the error accordingly
        }
    }


    async function login(userDetails) {
        return authServerCall("/auth/login", userDetails);
    }

    async function signup(userDetails) {
        return authServerCall("/auth/signup", userDetails);
    }

    async function logout() {
        try {
            await AsyncStorage.removeItem("upcare_user");
            clearUser();
        } catch (err) {
            clearUser();
            console.log(err);
        }
    }

    return {
        login,
        signup,
        logout,
    };
}
