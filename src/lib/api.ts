import axios from 'axios';

const inferApiUrlFromBrowserHost = () => {
    if (typeof window === 'undefined') {
        return 'http://localhost:5000/api';
    }

    const { protocol, hostname } = window.location;
    const apiProtocol = protocol === 'https:' ? 'https:' : 'http:';
    return `${apiProtocol}//${hostname}:5000/api`;
};

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || inferApiUrlFromBrowserHost();
    // Ensure the URL ends with /api to match backend routes
    if (!url.endsWith('/api') && !url.includes('/api/')) {
        url = url.endsWith('/') ? `${url}api` : `${url}/api`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
