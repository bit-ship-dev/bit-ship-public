import consola from 'consola';
import { useContainer } from '../../../services/container';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import os from 'os'
import { useStorage } from '@bit-ship/local-sdk';
import fs from 'fs';

const { runContainer, removeContainer, startContainer } = useContainer();

const containerName = 'bit-ship-demon'

export const start = async () => {
  consola.log('Bit-Ship demon starting')
  const { state } = useStorage()
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const projects = await state.projects.getAll()

  const volumes: string[] = [
    `${__dirname}/demon.mjs:/app/demon.mjs`,
    `${os.homedir()}/.bit-ship:/.bit-ship`,
  ]

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

  try {
    try {
      await startContainer(containerName)
      return consola.log('Demon proxy is running on port 80')
    } catch (err) {
      consola.log('Creating new demon instance')
      await runContainer({
        containerName,
        restart: 'unless-stopped',
        image: 'node:22-bookworm',
        detach: true,
        silentLog: true,
        remove: false,
        script: 'node /app/demon.mjs',
        ports: ['80:80'],
        volumes,
      })
    }
  } catch (err) {
    return consola.error('Demon unable to start', err)
  }

  consola.log('Demon proxy is running on port 80')
}

export const restart = async () => {
  try {
    await stop()
    await start()
  } catch (err) {
    consola.error('Error restarting bit-ship demon', err)
  }
}
export const stop = async () => {
  consola.log('Bit-Ship demon stopping')
  try {
    await removeContainer(containerName)
    consola.log('Demon stopped')
  } catch (err) {
    consola.error('Error stopping bit-ship demon', err)
  }
}

