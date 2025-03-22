export interface Task {
  script: string,
  location?: string,
  env? : {
    [key: string]: string
  }
  volumes?: string[]
}
