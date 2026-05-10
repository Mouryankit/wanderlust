


import axios from "axios";
import { getToken } from "../utils/token";

const API = axios.create({
  // Use VITE_API_URL if it exists, otherwise default to local
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = getToken();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;

});

export default API;