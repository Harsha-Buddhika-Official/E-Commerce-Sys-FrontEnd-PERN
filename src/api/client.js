import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 5000,
});

export default API;