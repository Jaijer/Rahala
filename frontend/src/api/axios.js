import axios from 'axios';

const api = axios.create({
    baseURL: "https://rahala.onrender.com", // Local development server http://localhost:5000
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
