import { spawn, exec } from 'child_process'
import consola from 'consola'
import { writeFile } from 'fs/promises'
import fs from 'fs';

export const useContainer = () => ({
  runContainer,
  removeContainer,
  startContainer,
  stopContainer
})

const runContainer = async (opts: RunOptions) => new Promise((resolve, reject) => {
  // eslint-disable-next-line prefer-const
  const log = getLogFunction(opts)
  let processOpts = {}

  if (!opts.detach) {
    processOpts = {
      ...processOpts,
      stdio: 'inherit',
      shell: true
    }
  }
  // eslint-disable-next-line sonarjs/no-os-command-from-path
  const childProcess = spawn('podman', prepareArgs(opts), processOpts);
  if (opts.onSpawn) {
    opts.onSpawn()
  }

  log('-------------------------- Running task', 'start', false)
  if (opts.detach) {
    childProcess.stdout.on('data', (data: any) => log(`${data}`, 'log'));
    childProcess.stderr.on('data', (data: any) => log(`${data}`, 'log'));
    childProcess.on('close', (code: any) => {
      log(`--------------------------/ Task finished code: ${code}`, 'success', false)
      if (code === 0) {
        return resolve(true)
      }
      return reject(true)
    });
  }
  // setupStoreLogs(opts, logContent)
})

async function startContainer(name: string) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    exec(`podman start ${name}`, (err, stdout, sederr) => {
      if (err) {
        reject(err)
      }
      resolve(err)
    });
  })
}


async function removeContainer(name: string) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    exec(`podman stop ${name} && podman rm ${name}`, (err, stdout, sederr) => {
      if (err) {
        reject(err)
      }
      resolve(err)
    });
  })
}

function stopContainer(name: string) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line
    exec(`podman stop ${name}`, (err, stdout, sederr) => {
      if (err) {
        reject(err)
      }
      resolve(err)
    });
  })
}

//=================> Helpers
const getLogFunction = (opts: RunOptions): LogHook => {
  const hookLogs: LogHook[] = []
  if (!opts.silentLog) {
    hookLogs.push((output, type) => {
      consola[type](output)
    })
  }
  return (...args) => hookLogs.forEach((hook) => hook(...args))
}


function prepareArgs(opts: RunOptions) {
  const name = opts.containerName ? ['--name', opts.containerName] : ''
  const env = opts?.env ? formatEnv(opts.env) : []
  const volumes = opts.volumes?.reduce((acc: string[], vol) => {
    acc.push('-v', vol)
    return acc
  }, []) || []

  const logs = opts.dontStoreLogs ? [] : [
    '--log-driver', 'k8s-file',
    '--log-opt', `path=$HOME/.bit-ship/logs/${opts.containerName}.log`,
  ]
  const platform = opts.platform ? ['--platform', opts.platform] : []
  const restart = opts.restart ? ['--restart', opts.restart] : []
  const rm = opts.remove ? ['--rm'] : []
  const ports = opts.ports?.reduce((acc: string[], port) => {
    acc.push('-p', port)
    return acc
  }, []) || []
  const detach = opts.detach ? ['-d'] : ['-it']
  const script = opts.script ? [...opts.script.split(' ')] : [];
  const args = [
    'run',
    ...rm,
    ...name,
    '-w', '/app',
    ...env,
    ...volumes,
    ...logs,
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

type LogHook = (output: any, type: 'log' | 'error' | 'success' | 'start') => void


export interface RunOptions {
  onSpawn?: () => void
  containerName: string
  image: string
  dontStoreLogs?: boolean
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
