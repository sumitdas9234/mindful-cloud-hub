
// Environment configuration
const env = {
  // API URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  
  // Feature flags
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false,
  
  // App settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Infrastructure Manager',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || false,
};

export default env;
