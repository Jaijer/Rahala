import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000", // The backend server url https://rahala.onrender.com
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;

