import axiosClient from "./axiosClient";

// ទាញយកបញ្ជីផលិតផលទាំងអស់ (ព្រមទាំងគាំទ្រ Pagination, Search និង Filter)
export const getAllProducts = (params) =>
  axiosClient.get("/products", { params });

// ទាញយកព័ត៌មានលម្អិតរបស់ទូរស័ព្ទមួយគ្រឿង តាមរយៈ ID
export const getProductDetails = (id) => axiosClient.get(`/products/${id}`);
