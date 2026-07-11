import axiosClient from "./axiosClient";

export const getAllCategories = (params) =>
  axiosClient.get("/categories", { params });