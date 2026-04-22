import axios from 'axios';

//  Configuración global de Axios para enviar cookies en TODAS las peticiones
axios.defaults.withCredentials = true;

// Interceptor para manejar errores 401 (token expirado/inválido)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Verificar si es el endpoint de login - no redirigir en ese caso
      const isLoginEndpoint = error.config?.url?.includes('/login');
      const isOnLoginPage = window.location.pathname === '/' || window.location.pathname === '/login';
      
      // Solo redirigir si NO es el login (para evitar reloads en la página de login)
      if (!isLoginEndpoint && !isOnLoginPage) {
        // Token expirado o inválido
        console.error('Token inválido o expirado, redirigiendo al login...');
        
        // Redirigir al login
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;