export const useEnvironment = () => ({
  apiURL: process.env.API_URL || 'https://api.bit-ship.dev',
})
