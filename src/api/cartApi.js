import axiosClient from "./axiosClient";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

//  ថែមទំនិញចូលកន្ត្រក
export const apiAddToCart = (productId, quantity) => {
  return axiosClient.post("/cart", { productId, quantity }, getHeaders());
};

//  ទាញយកទិន្នន័យកន្ត្រកពី DB
export const apiGetCart = () => {
  return axiosClient.get("/cart", getHeaders());
};

//  លុបទំនិញមួយចេញពីកន្ត្រក
export const apiRemoveFromCart = (productId) => {
  return axiosClient.delete(`/cart/${productId}`, getHeaders());
};
