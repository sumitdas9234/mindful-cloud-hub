
// Environment configuration
const env = {
  // API URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  USERS_API_URL: import.meta.env.VITE_USERS_API_URL || 'https://api.example.com/users',
  
  // Resource API URLs
  RESOURCE_API: {
    CPU: import.meta.env.VITE_CPU_API_URL || 'https://run.mocky.io/v3/017f8e99-9d68-4fe2-8872-df0f393a5825',
    MEMORY: import.meta.env.VITE_MEMORY_API_URL || 'https://run.mocky.io/v3/b01b3418-b832-4cad-9051-464b1de82f4a',
    STORAGE: import.meta.env.VITE_STORAGE_API_URL || 'https://run.mocky.io/v3/260d19e4-bbac-4528-8722-7941e2d04d4d',
  },
  
  // Feature flags
  USE_MOCK_DATA: false,
  
  // App settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Infrastructure Manager',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || false,
};

export default env;
