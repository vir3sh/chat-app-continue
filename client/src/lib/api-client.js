import axios from "axios";
import { HOST } from "@/utils/constant";

const apiClient = axios.create({
    baseURL: HOST, // corrected from baseUrl to baseURL
});

export default apiClient;
