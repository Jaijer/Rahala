import axios from 'axios';

const api = axios.create({
    baseURL: "https://rahala.onrender.com", // Local development server https://rahala.onrender.com
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
