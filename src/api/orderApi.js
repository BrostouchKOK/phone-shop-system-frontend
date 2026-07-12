import axiosClient from "./axiosClient";

// for admin and customer
export const createOrder = (orderData) => {
  return axiosClient.post("/orders", orderData);
};
export const apiGetMyOrders = async () => {
  return await axiosClient.get("/orders/myorders");
};

// for admin only
export const apiAdminGetAllOrders = async (params) => {
  return await axiosClient.get("/orders", { params });
};
export const apiAdminUpdateOrderStatus = async (orderId, status) => {
  return await axiosClient.put(`/orders/${orderId}/status`, { status });
};
