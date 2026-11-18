import axios from "axios";
import { apiUrl } from "./ApiUrl";

const AuthService = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default AuthService;