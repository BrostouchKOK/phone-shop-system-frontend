import axiosClient from "./axiosClient";

export const getAllProducts = (params) =>
  axiosClient.get("/products", { params });
export const getProductDetails = (id) => axiosClient.get(`/products/${id}`);
export const createProduct = (formData) =>
  axiosClient.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProduct = (id) => axiosClient.delete(`/products/${id}`);
export const updateProduct = (id, formData) =>
  axiosClient.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
