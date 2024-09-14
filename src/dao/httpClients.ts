import axios from "axios";
import Cookies from "js-cookie";
import { appConfig } from "../dataConfig";

const authorization = Cookies.get("jwt")

const analytikillClient = axios.create({
    baseURL: appConfig.endpoints.analytikill,
    timeout: 5000,
    headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${authorization}`,
    },
})

export const analytikillHttpClient = analytikillClient;