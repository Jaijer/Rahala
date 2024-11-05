import axios from 'axios';

const api = axios.create({
    baseURL: "https://rahala.onrender.com", // The backend server url
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;

