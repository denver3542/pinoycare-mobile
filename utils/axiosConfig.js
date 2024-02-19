import axios from "axios"

// Staging url = https://phplaravel-719501-3973159.cloudwaysapps.com/api 
// Production url = https://upcareph.com/api 

const baseURL = "https://phplaravel-719501-3973159.cloudwaysapps.com/api"

const axiosInstance = axios.create({
    baseURL,
})

export function getJWTHeader(user) {
    return {
        Authorization: `Bearer ${user.token}`
    }
}

export default axiosInstance