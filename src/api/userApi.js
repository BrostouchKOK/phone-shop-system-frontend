import axiosClient from "./axiosClient"; 


export const apiGetUserProfile = async () => {
  return await axiosClient.get("/users/profile"); 
};

export const apiUpdateUserProfile = async (userData) => {
  return await axiosClient.put("/users/profile", userData);
};