import axios from "axios"


const baseURL = "https://phplaravel-719501-3973159.cloudwaysapps.com/api"

const axiosInstancee = axios.create({
    baseURL,
})

export function getJWTHeader(user) {
    return {
        Authorization: `Bearer ${user.token}`
    }
}

export default axiosInstancee