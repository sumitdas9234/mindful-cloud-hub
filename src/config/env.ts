
// Environment configuration
const env = {
  // API URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  USERS_API_URL: import.meta.env.VITE_USERS_API_URL || 'https://run.mocky.io/v3/6b5efe7c-d587-4847-a50c-b652618752a4',
  
  // Feature flags
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false,
  
  // App settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Infrastructure Manager',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || false,
};

export default env;
