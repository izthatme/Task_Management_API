import axios from 'axios';
export const api = axios.create({
baseURL: "https://task-management-api-lwre.onrender.com/api",
withCredentials: true,
});