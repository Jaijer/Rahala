import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000", // Local development server https://rahala.onrender.com
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
