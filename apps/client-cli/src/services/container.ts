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
  // eslint-disable-next-line prefer-const
  let logContent = ''
  const log = getLogFunction(logContent, opts)
  let processOpts = {}

  if(!opts.detach) {
    processOpts = {
      ...processOpts,
      stdio: 'inherit',
      shell: true
    }
  }

  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const childProcess = spawn('docker', prepareArgs(opts),processOpts);
  if (opts.onSpawn) {
    opts.onSpawn()
  }

  log('-------------------------- Running task', 'start', false)
  if(opts.detach){ 
    childProcess.stdout.on('data', (data: any) => log(`${data}`, 'log'));
    childProcess.stderr.on('data', (data: any) => log(`${data}`,'log'));
    childProcess.on('close', (code: any) => {
      resolve(true)
      log(`--------------------------/ Task finished code: ${code}`, 'success', false)
    });
  }
  setupStoreLogs(opts, logContent)
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

//=================> Helpers
const getLogFunction = (logContent: string, opts: RunOptions) => opts.silentLog ?
  (output: any, _type: string, store = true) => {if (store){logContent += '\n' + output}} :
  (output: any, type: 'log' | 'error' | 'success' | 'start', store = true) => {
    if (store) {
      logContent += '\n' + output
    }
    consola[type](output)
  }

function setupStoreLogs(opts: RunOptions, logContent: string) {
  if(opts.storeLogs) {
    const date = new Date()
    const prefix = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`
    const path = '.bit-ship/logs'
    if(!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    writeFile(`${path}/${prefix}_${opts.taskName}.log`, logContent)
  }
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

  const detach = opts.detach ? ['-d'] : ['-it']

  const script = opts.script ? [...opts.script.split(' ')] : [] ;

  const args= [
    'run',
    ...rm,
    ...name,
    '-w', '/app',
    ...env,
    ...volumes,
    ...platform,
    ...restart,
    ...ports,
    ...detach,
    opts.image, 
    ...script
  ]
  return args
}

function formatEnv(env: any) {
  return Object.entries(env).map(([key, value]) => `-e ${key}=${value}`)
}



export interface RunOptions {
  onSpawn?: () => void
  containerName: string
  image: string
  storeLogs?: boolean
  script?: string
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
