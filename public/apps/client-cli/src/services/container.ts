import {spawn, exec} from 'child_process';
import consola from 'consola';
import {writeFile} from 'fs/promises';
import fs from 'fs';

export const useContainer = () => ({
  runContainer,
  removeContainer
})

const runContainer = async (opts: RunOptions) => new Promise((resolve) => {
  const args= prepareArgs(opts)

  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const process = spawn('docker', args);

  let logContent = ''
  const log = opts.silentLog ?
    (output: any, _type: string, store = true) => {if (store){logContent += '\n' + output}} :
    (output: any, type: 'log' | 'error' | 'success' | 'start', store = true) => {
      if (store) {
        logContent += '\n' + output
      }
      consola[type](output)
    }

  log('-------------------------- Running task', 'start', false)
  process.stdout.on('data', (data: any) => log(`${data}`, 'log'));
  process.stderr.on('data', (data: any) => log(`${data}`,'log'));
  process.on('close', (code: any) => {
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


function formatEnv(env: any) {
  return Object.entries(env).map(([key, value]) => `${key}=${value}`)
}


function prepareArgs(opts){
  const name = opts.containerName? ['--name', opts.containerName] : ''
  const env = opts?.env ? ['-e', ...formatEnv(opts.env)]: []
  const volumes = opts.volumes?.reduce((acc: string[],vol) => {
    acc.push('-v', vol)
    return acc
  },[]) || []
  const platform = opts.platform ? ['--platform', opts.platform] : []
  const restart = opts.restart ? ['--restart', opts.restart]: []
  const rm = opts.remove ? ['--rm'] : []
  const ports = opts.ports ? ['-p', ...opts.ports] : []
  const detouched = opts.detouched ? ['-d'] : []

  return  [
    'run', ...rm, ...name,
    '-w', '/app', ...env, ...volumes,
    ...detouched,
    ...platform,
    ...restart,
    ...ports,
    opts.image, ...opts.script.split(' '),
  ]

}


async function removeContainer  (name: string) {
  return new Promise((resolve) => {
    // eslint-disable-next-line
    exec(`docker stop ${name} && docker rm ${name}`, () => {
      resolve(true)
    });
  })
}


export interface RunOptions {
  containerName: string;
  image: string;
  storeLogs?: boolean;
  script: string;
  remove: boolean;
  platform?: string;
  detouched?: boolean;
  silentLog?: boolean;
  ports?: string[];
  taskName?: string;
  restart?: 'unless-stopped'
  volumes?: string[];
  env?: {
    [key: string]: string
  }
}
