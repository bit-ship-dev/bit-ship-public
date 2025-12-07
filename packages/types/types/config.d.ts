// Config is stored in bit-ship.yml file
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

  // Images are used as environment for running tasks
  images: {
    [imageName: string]: {
      // Name of image on registry
      name: string,
      // Path to local Dockerfile to build (To be Implemented)
      build: string,
      // List of dependencies contained in image
      dependencies?: {
        [key in string]?: string
      }
    }
  }

  // Vaults is used to store env variables
  vaults?: {
    // Vault can be string with name of the file or containe object of env varialbes
    [vaultName : string]: {
      file: string
      env: {
        [key: string]: string
      }
    }
  }

  // Volumes container file storage to external source
  volumes?: {
    [vaultName : string]: {
      // list of volume 
      fs: string[]   
    }
  }

  // Tasks are command our entryfiles to be executed 
  tasks: {
    [taskName: string]: {
      // Name of image
      image: string | Config_1_0['images']['__EXAMPLE__'],
      // Command to be run
      command?: string,
      // Environment variables 
      vaults?: Config_1_0['vaults']['__EXAMPLE__'] | Config_1_0['vaults']['__EXAMPLE__'][] | string | string[]
      volumes?: Config_1_0['volumes']['__EXAMPLE__'] | Config_1_0['volumes']['__EXAMPLE__'][] | string | string[]
      // Option to pass directly to docker (To be Implemented)
      // https://docs.docker.com/reference/compose-file/services/#build
      dockerOptions: any
    }
  }

  // Jobs are chains of tasks that can be run together and executed on events.
  jobs?: {
    [jobName: string]: {
      // Automatic job trigger
      on: {
        // commit triggers
        commit?: 'pre-commit' | 'post-commit'
      },
      // name of the task to be run
      tasks: Array<string | string[]> | Array<Config_1_0['tasks']['__EXAMPLE__'] | Config_1_0['tasks']['__EXAMPLE__'][]>
    }
  }

  // Apps are task that serve your application
  apps?: {
    [appName: string]: {
      // Name of task to be run
      task: string | Config_1_0['tasks']['__EXAMPLE__'],

      // Expose ports for the app
      expose: {
        // host under which your app is accessible from proxy
        localHost?: string,

        // Port where the app runs
        port?: number,

        // Access sets the bit-ship network access
        // - public: port exposed to host machine directly
        // - proxy-public: port exposed for proxy server
        access?: 'public' | 'proxy-public'
      }[]
    }
  }


}


