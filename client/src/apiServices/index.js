import axios from "axios";
export const API_URL = "https://www.anibelika.com";
export const _prefix = "/api/v1";
export const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});