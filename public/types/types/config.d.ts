import {ToolsNames} from "./shared";

// Config is store in bit-ship.yml file
// It contains all necessary information to use bit-ship in the project
// It derived from report with some additional information from user.
// Then it can be modified by user


export interface Config {
  '1.0': Config_1_0
}


interface Config_1_0 {
  // Report version
  version: '1.0'

  // Project name
  name?: string

  // Image for tasks and scripts
  images: {
    [imageName: 'default' | string] : {
      name: string,
      dependencies?: {
        [key in ToolsNames]?: string
      }
    }
  }

  tasks: {
    [key: string]: {
      script: string,
      localURL?: string,
      location?: string,
      env? : {
        [key: string]: string
      }
      ports?: string[]
      volumes?: string[]
    }
  }

  volumes: {}
}
