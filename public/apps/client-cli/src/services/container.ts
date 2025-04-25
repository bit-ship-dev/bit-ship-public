import {spawn, exec} from 'child_process'
import consola from 'consola'
import {writeFile} from 'fs/promises'
import fs from 'fs';

export const useContainer = () => ({
  runContainer,
  removeContainer,
  stopContainer
})

const runContainer = async (opts: RunOptions) => new Promise((resolve) => {
  const args= prepareArgs(opts)

  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const childProcess = spawn('docker', args);
  if (opts.onSpawn) {
    opts.onSpawn()
  }

  let logContent = ''
  const log = opts.silentLog ?
    (output: any, _type: string, store = true) => {if (store){logContent += '\n' + output}} :
    (output: any, type: 'log' | 'error' | 'success' | 'start', store = true) => {
      if (store) {
        logContent += '\n' + output
      }
      consola[type](output)
    }


  if(!opts.detach) {
    process.on('SIGINT', cleanup(childProcess, opts.containerName));
    process.on('SIGTERM', cleanup(childProcess, opts.containerName));
    process.on('exit', cleanup(childProcess, opts.containerName));
  }

  log('-------------------------- Running task', 'start', false)
  childProcess.stdout.on('data', (data: any) => log(`${data}`, 'log'));
  childProcess.stderr.on('data', (data: any) => log(`${data}`,'log'));
  childProcess.on('close', (code: any) => {
    resolve(true)
    log(`--------------------------/ Task finished code: ${code}`, 'success', false)
  });

  if(opts.storeLogs) {
    const date = new Date()
    const prefix = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`
    const path = '.bit-ship/logs'
    if(!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    writeFile(`${path}/${prefix}_${opts.taskName}.log`, logContent)
  }
})



async function removeContainer (name: string) {
  return new Promise((resolve) => {
    // eslint-disable-next-line
    exec(`docker stop ${name} && docker rm ${name}`, () => {
      resolve(true)
    });
  })
}

function stopContainer(name: string) {
  return new Promise((resolve) => {
    // eslint-disable-next-line
    exec(`docker stop ${name}`, () => {
      resolve(true)
    });
  })

}

function prepareArgs(opts: RunOptions){
  const name = opts.containerName? ['--name', opts.containerName] : ''
  const env = opts?.env ? formatEnv(opts.env) : []
  const volumes = opts.volumes?.reduce((acc: string[],vol) => {
    acc.push('-v', vol)
    return acc
  },[]) || []
  const platform = opts.platform ? ['--platform', opts.platform] : []
  const restart = opts.restart ? ['--restart', opts.restart]: []
  const rm = opts.remove ? ['--rm'] : []
  const ports = opts.ports?.reduce((acc: string[],port) => {
    acc.push('-p', port)
    return acc
  },[]) || []

  const detach = opts.detach ? ['-d'] : []

  const args= [
    'run',
    ...rm,
    ...name,
    '-w', '/app',
    ...env,
    ...volumes,
    ...detach,
    ...platform,
    ...restart,
    ...ports,
    opts.image, ...opts.script.split(' '),
  ]
  return args
}



const cleanup = (childProcess: any, container: string) => () => {
  if (childProcess && !childProcess.killed) {
    console.log('\nKilling child process...');
    stopContainer(container)
  }
}

function formatEnv(env: any) {
  return Object.entries(env).map(([key, value]) => `-e ${key}=${value}`)
}



export interface RunOptions {
  onSpawn?: () => void
  containerName: string
  image: string
  storeLogs?: boolean
  script: string
  remove: boolean
  platform?: string
  detach?: boolean
  silentLog?: boolean
  ports?: string[]
  taskName?: string
  restart?: 'unless-stopped'
  volumes?: string[]
  env?: {
    [key: string]: string
  }
}
