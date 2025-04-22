import type {Job} from './config/job'
import type {App} from './config/app'
import type {Task} from './config/task'
import type {Image} from './config/image'

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
    [imageName: string] : Image
  }

  vaults?: {}

  tasks?: {
    [key: string]: Task
  }

  jobs?: {
    [jobName: string]: Job
  }

  apps?: {
    [appName: string]: App
  }

  // volumes: {}
}

