import axiosClient from "./axiosClient";

// សរសេរខ្លីៗបែបនេះ ងាយស្រួលគ្រប់គ្រង និងស្អាតបំផុត
export const loginUser = (data) => axiosClient.post("/auth/login", data);
export const registerUser = (data) => axiosClient.post("/auth/register", data);
export const verifyOtp = (data) => axiosClient.post("/auth/verify-otp", data);