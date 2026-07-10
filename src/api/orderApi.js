import axiosClient from "./axiosClient";

// បង្កើតការបញ្ជាទិញថ្មី (ទាមទារ Token ព្រោះត្រូវដឹងថាអ្នកណាជាអ្នកទិញ)
export const createOrder = (orderData) => {
  const token = localStorage.getItem("token");
  return axiosClient.post("/orders", orderData, {
    headers: {
      Authorization: `Bearer ${token}`, // បោះ Token ទៅឱ្យ Backend ឆែក
    },
  });
};