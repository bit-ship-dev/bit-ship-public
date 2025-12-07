import consola from 'consola'
import { useContainer } from '../../../services/container'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import { useStorage } from '@bit-ship/local-sdk'
import fs from 'fs'

const { stopContainer, runContainer, removeContainer, startContainer } = useContainer()

const containerName = 'bit-ship-demon'

export const start = async () => {
  consola.log('Bit-Ship demon starting')
  try {
    try {
      await startContainer({ containerName, detach: true })
      return consola.log('Demon proxy is running on port 80')
      // eslint-disable-next-line
    } catch (_err) {
      consola.log('Unable to start container creating neew one')
      await create()
    }
  } catch (err) {
    consola.error('Demon unable to start', err)
    consola.log('Demon proxy is running on port 80')
    return
  }
}

const create = async () => {
  consola.log('Creating new demon instance')
  const { state } = useStorage()
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const projects = await state.projects.getAll()
  const volumes: string[] = [`${__dirname}/demon.mjs:/app/demon.mjs`, `${os.homedir()}/.bit-ship:/.bit-ship`]

  if (projects) {
    Object.keys(projects).forEach(async (key) => {
      const path = projects[key].pathInHostMachine
      if (fs.existsSync(path)) {
        return volumes.push(`${path}:/projects/${key}`)
      }
      consola.warn(`Path ${path} does not exist, removing project`)
      await state.projects.findOne(key).remove()
    })
  }
  await runContainer({
    containerName,
    restart: 'unless-stopped',
    image: 'node:22-bookworm',
    detach: true,
    remove: false,
    script: 'node /app/demon.mjs',
    ports: ['80:80'],
    volumes
  })
}

export const stop = async () => {
  consola.log('Bit-Ship demon stopping')
  try {
    await stopContainer(containerName)
    // eslint-disable-next-line
  } catch (_err) {
    consola.error('Demon is not running')
  }
  try {
    consola.log('Removing demon container')
    await removeContainer(containerName)
    consola.log('Demon removed')
    // eslint-disable-next-line
  } catch (_err) {
    consola.error('Container does not exists')
  }
}

export const restart = async () => {
  try {
    await stop()
     
  } catch (err) {
    consola.error('Error stopping demon', err)
  }
  try {
    await create()
    // eslint-disable-next-line
  } catch (err) {
    consola.error('Demon in not able to start')
  }
}
