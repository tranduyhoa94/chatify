import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:3000/api';
    }
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    return '/api';
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;