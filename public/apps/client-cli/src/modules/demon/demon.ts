import {defineCommand} from 'citty';
import consola from 'consola';
import {useContainer} from '../../services/container';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import os from 'os'
import {useStorage} from '../../services/storage';

const {runContainer, removeContainer} = useContainer();

const containerName = 'bit-ship-demon'

export default defineCommand({
  meta: {
    name: 'demon',
    description: 'Start or stop bit-ship demon',
  },
  subCommands: {
    start: {
      meta: {name: 'start', description: 'Start bit-ship demon'},
      async run() {
        consola.log('Bit-Ship demon starting')
        await startDemon()
        consola.log('Demon proxy is running on port 80')
      }
    },
    restart: {
      meta: {name: 'restart', description: 'restart bit-ship demon'},
      async run() {
        consola.log('Bit-Ship demon restarting')
        try {
          await restartDemon()
          consola.log('Demon restarted')
        } catch (err) {
          consola.error('Error restarting bit-ship demon', err)
        }
      }
    },
    stop: {
      meta: {name: 'stop', description: 'Stop bit-ship demon',},
      async run() {
        consola.log('Bit-Ship demon stopping')
        try {
          await stopDemon()
          consola.log('Demon stopped')
        } catch (err) {
          consola.error('Error stopping bit-ship demon', err)
        }
      }
    },
  },
});


export async function stopDemon() {
  await removeContainer(containerName)
}
export async function restartDemon() {
  await stopDemon()
  await startDemon()
}


export async function startDemon() {
  const {getItem} = useStorage()
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const projects =  await getItem('projects')

  const volumes: string[] = [
    `${__dirname}/demon.mjs:/app/demon.mjs`,
    `${os.homedir()}/.bit-ship:/.bit-ship`,
  ]

  if (projects) {
    Object.keys(projects).forEach((key) => {
      volumes.push(`${key}:/projects/${projects[key]}`)
    })
  }

  await runContainer({
    containerName,
    restart: 'unless-stopped',
    image: 'node:22-alpine',
    detouched: true,
    silentLog: true,
    remove: false,
    storeLogs: false,
    script: 'node /app/demon.mjs',
    ports: ['80:80'],
    volumes,
  })
}



