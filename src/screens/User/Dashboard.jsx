import axiosInstance, { getJWTHeader } from "../../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

function Dashboard(activeNav) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {

                const storedUser = await AsyncStorage.getItem("upcare_user");
                if (!storedUser) {
                    return;
                }
                const user = JSON.parse(storedUser);

                const response = await axiosInstance.get("/jobs", {
                    headers: getJWTHeader(user)
                });

                setJobs(response.data.jobs);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);


}

export default Dashboard;
