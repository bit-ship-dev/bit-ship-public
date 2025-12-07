const env = {
  apiURL: process.env.API_URL || 'https://app.bit-ship.dev/api',
  newProject: false,
}

export const useEnvironment = () => ({
  env,
  setEnv: (key: string, val: any) => env[key] = val
})
