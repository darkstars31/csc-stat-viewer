import axios from "axios";
import Cookies from "js-cookie";
import { appConfig } from "../dataConfig";

const authorization = Cookies.get("jwt")

const useLocalApi = false;
const baseURL = useLocalApi ? "http://localhost:3001" : appConfig.endpoints.analytikill;

const analytikillClient = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${authorization}`,
    },
})

export const analytikillHttpClient = analytikillClient;