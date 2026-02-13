import { Platform } from "react-native";

export const API_URL =
    Platform.OS === "android"
        ? "http://10.20.166.218:3000"
        : "http://localhost:3000";