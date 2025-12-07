import { useStorage } from '@bit-ship/local-sdk'
import { glob } from 'glob'
import { hash } from 'ohash'
import { useEnvironment } from './environment'
import consola from 'consola'

import { exec } from 'child_process'

// eslint-disable-next-line
let projectId = ''

export async function setupProject() {
  const { state } = useStorage()
  // ProjectId format {hostMachinePathHash}-{gitOriginHash}
  const projectsKeys = await state.projects.getAllKeys()
  let id = ''

  //1. Is this path project
  const locationHash = hash(process.cwd())
  id = projectsKeys.find((key: string) => key.includes(locationHash))
  if (id) {
    projectId = id
    return
  }

  //2. is this git origin project
  const gitOrigin = await getGitOrigin()
  const originHash = hash(gitOrigin)
  id = projectsKeys.find((key: string) => key.includes(originHash))
  if (id) {
    projectId = id
    return
  }

  //3. does it cointaine bit-ship file?
  const bitShipFile = await glob('.bit-ship/bit-ship.yml')
  if (!bitShipFile) {
    return
  }

  consola.log('Adding to list of projects')
  const project = {
    gitOrigin,
    pathInHostMachine: process.cwd(),
    apps: {},
    jobs: {},
    tasks: {}
  }
  const projectID = `${locationHash}-${originHash}`
  await state.projects.findOne(projectID).set(project)
  useEnvironment().setEnv('newProject', true)
}

function getGitOrigin(): Promise<string> {
  return new Promise((resolve) => {
    // eslint-disable-next-line
    exec('git config --get remote.origin.url', (error: Error, stdout: string) => {
      if (error) {
        resolve('')
      } else {
        resolve(stdout.trim())
      }
    })
  })
}
