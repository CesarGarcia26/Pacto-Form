// src/services/coberturasService.js
import axios from "axios";
import { useAuth } from "../Context/authContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useCoberturasService = () => {
  const { userInfo } = useAuth();

  const fetchCoberturas = async (endpoint) => {
    try {
      const response = await axios.get(`${API_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error al obtener coberturas ${endpoint}:`, error);

      if (error.response?.status === 401) {
        console.error("Token inválido o expirado");
      }

      return [];
    }
  };

  // 🟢 Pragma / Ceiba / Perceptio
  const getCoberturasPyC = async () => fetchCoberturas("pyc");

  // 🟢 Susanita
  const getCoberturasSusanita = async () => fetchCoberturas("susanita");

  // 🟢 Nuvant
  const getCoberturasNuvant = async () => fetchCoberturas("nuvant");

  // 🔵 PIRANI
  const getCoberturasPirani = async () => fetchCoberturas("pirani");

  // 🟣 ROLPARTS 🔥 (NUEVO)
  const getCoberturasRolparts = async () => fetchCoberturas("rolparts");

  // 🟣 Hermanas GODWNA 🔥 (NUEVO)
  const getCoberturasGondwana = async () => fetchCoberturas("gondwana");

  // 🟣 Hermanas GODWNA 🔥 (NUEVO)
  const getCoberturasMaquel = async () => fetchCoberturas("maquel");

  // ACRRIN
  const getCoberturasAcrrin = async () => fetchCoberturas("acrrin");


  return {
    getCoberturasPyC,
    getCoberturasSusanita,
    getCoberturasNuvant,
    getCoberturasPirani,
    getCoberturasRolparts,
    getCoberturasGondwana,
    getCoberturasMaquel,
    getCoberturasAcrrin
  };
};
