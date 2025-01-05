export const useEnvironment = () => ({
  apiURL: process.env.API_URL || 'http://localhost:3000/api',
})
