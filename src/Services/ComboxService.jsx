// src/services/ubicacionService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/ubicacion"; // Ajusta el puerto si es distinto

export const obtenerDepartamentos = async () => {
  const response = await axios.get(`${API_URL}/departamentos`);
  return response.data;
};

export const obtenerCiudadesPorDepartamento = async (departamentoId) => {
  const response = await axios.get(`${API_URL}/ciudades/${departamentoId}`);
  return response.data;
};

export const obtenerEnfermedades = async () => {
  const response = await axios.get(`${API_URL}/enfermedades`);
  return response.data;
};