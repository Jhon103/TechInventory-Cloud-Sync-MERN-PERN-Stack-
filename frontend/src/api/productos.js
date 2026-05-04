import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProductos = (q = '') =>
  API.get(`/productos${q ? `?q=${encodeURIComponent(q)}` : ''}`);

export const getProductoById = (id) => API.get(`/productos/${id}`);

export const crearProducto = (data) => API.post('/productos', data);

export const actualizarProducto = (id, data) => API.put(`/productos/${id}`, data);

export const eliminarProducto = (id) => API.delete(`/productos/${id}`);