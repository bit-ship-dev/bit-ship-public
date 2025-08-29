export const useEnvironment = () => ({
  apiURL: process.env.API_URL || 'https://app.bit-ship.dev/api',
})
