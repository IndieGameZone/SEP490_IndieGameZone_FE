import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
export const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Accept'] = 'application/json';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<unknown> => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        }
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.post<string>(
                    `${BASE_URL}/api/authentications/refresh-token`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const newAccessToken = response.data;
                localStorage.setItem('accessToken', newAccessToken);

                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                return axiosClient(originalRequest);
            } catch (err) {
                console.error(err);
                processQueue(err, null);
                localStorage.removeItem('accessToken');
                // Optional: redirect to login
                // window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
