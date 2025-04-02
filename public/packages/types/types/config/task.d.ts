export interface Task {
  // Command to be run
  script: string,
  // location in which the command will be run
  location?: string,
  // Environment variables to be set
  env? : {
    [key: string]: string
  }
  volumes?: string[]
}
