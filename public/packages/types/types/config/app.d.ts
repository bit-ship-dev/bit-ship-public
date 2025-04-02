export interface App {
  // URL under which the app will be available locally
  localURL?: string,
  // Ports to be exposed
  ports?: string[]
  // Name of task to be run
  task: string
}
