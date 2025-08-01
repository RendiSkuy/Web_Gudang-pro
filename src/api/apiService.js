import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api' // Sesuaikan port jika perlu
});

// ... (interceptor biarkan saja)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const login = (formData) => api.post('/auth/login', formData);

// --- BARANG ---
// Tambahkan parameter status
export const getBarang = (status = 'active', search = '') => 
    api.get('/barang', { params: { status, search } });
export const createBarang = (barangData) => api.post('/barang', barangData);
export const updateBarang = (id, barangData) => api.put(`/barang/${id}`, barangData);

export default api;