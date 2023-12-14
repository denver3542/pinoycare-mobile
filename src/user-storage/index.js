import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_LOCALSTORAGE_KEY = 'upcare_user';
const REMEMBERED_USER_LOCALSTORAGE_KEY = 'upcare_remembered_user'

// helper to get user from localstorage
export async function getStoredUser() {
    const storedUser = await AsyncStorage.getItem(USER_LOCALSTORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
}

export function setStoredUser(user) {
    if (user) {
        AsyncStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
    }
}

export function clearStoredUser() {
    AsyncStorage.removeItem(USER_LOCALSTORAGE_KEY);
    AsyncStorage.removeItem("global__expiryTimestamp");
    AsyncStorage.removeItem("global__ongoingTestId");
}

export function setStoredRememberedUser(user) {
    AsyncStorage.setItem(REMEMBERED_USER_LOCALSTORAGE_KEY, JSON.stringify(user));
}

export async function getStoredRememberedUser() {
    const storedInfo = await AsyncStorage.getItem(REMEMBERED_USER_LOCALSTORAGE_KEY);
    return storedInfo ? JSON.parse(storedInfo) : null;
}

export function clearStoredRememberedUser() {
    AsyncStorage.removeItem(REMEMBERED_USER_LOCALSTORAGE_KEY);
}