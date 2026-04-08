// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true
// });

// export default API;




import axios from "axios";

const API = axios.create({
  // Use VITE_API_URL if it exists, otherwise default to local
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;

});

export default API;