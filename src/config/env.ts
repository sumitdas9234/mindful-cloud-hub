
// Environment configuration
const env = {
  // API URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  USERS_API_URL: import.meta.env.VITE_USERS_API_URL || 'https://api.example.com/users',
  
  // Feature flags
  USE_MOCK_DATA: false,
  
  // App settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Infrastructure Manager',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || false,
};

export default env;
