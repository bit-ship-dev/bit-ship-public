export interface App {
  // Name of task to be run
  task: string
  // Expose ports for the app
  expose: Expose[]
}

interface Expose {
  // URL under which your app will be available locally on your machine
  localHost?: string
  // Port where the app runs
  port?: number
  // Access sets the bit-ship network access
  // - public: app port is exposed to host machine for example localhost:8080
  // - proxy-public: app expose port only for the proxy server that runs under the host machine localhost:80
  access? : 'public' | 'proxy-public'
}
