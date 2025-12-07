import { spawn } from 'child_process'
import consola from 'consola'

export const useContainer = () => ({
  runContainer,
  removeContainer,
  startContainer,
  stopContainer
})

const runContainer = async (opts: RunOptions) =>
  new Promise((res, _rej) => {
    const args = prepareArgs(opts)
    spawnProcess(args, {
      detach: opts.detach,
      onSpawn: () => {
        return res(true)
      }
    })
  })

const startContainer = async (opts: StartOptions) =>
  new Promise((res, rej) => {
    spawnProcess(['start', opts.containerName], {
      detach: opts.detach,
      onSpawn: () => {
        if (!opts.detach) {
          return res(true)
        }
      },
      onClose: (code) => {
        if (opts.detach) {
          if (code === 0) {
            return res(true)
          }
          rej()
        }
      }
    })
  })

const removeContainer = async (name: string) =>
  new Promise((res, rej) => {
    spawnProcess(['rm', name], {
      detach: true,
      onClose: (code) => {
        if (code === 0) {
          return res(true)
        }
        rej()
      }
    })
  })

const stopContainer = async (name: string) =>
  new Promise((res, rej) => {
    spawnProcess(['stop', name], {
      detach: true,
      onClose: (code) => {
        if (code === 0) {
          return res(true)
        }
        rej()
      }
    })
  })

//=================> Helpers

function spawnProcess(args: string[], opts: ProcessOptions) {
  const log = getLogFunction(opts)
  // eslint-disable-next-line
  const childProcess = spawn('podman', args, {
    shell: true
    // stdio: 'inherit'
    // stdio: 'pipe'
  })

  if (opts.onSpawn) {
    opts.onSpawn()
  }

  log('-------------------------- Running task', 'log')
  childProcess.stdout.on('data', (data: any) => log(`${data}`, 'log'))
  childProcess.stderr.on('data', (data: any) => log(`${data}`, 'log'))
  childProcess.on('close', (code: any) => {
    log(`--------------------------/ Task finished code: ${code}`, 'log')
    if (opts.onClose) {
      opts.onClose(code)
    }
  })
}

const getLogFunction = (opts: ProcessOptions): LogHook => {
  const hookLogs: LogHook[] = []
  if (!opts.detach) {
    hookLogs.push((output, type) => {
      consola[type](output)
    })
  }
  return (...args) => hookLogs.forEach((hook) => hook(...args))
}

function prepareArgs(opts: RunOptions) {
  const name = opts.containerName ? ['--name', opts.containerName] : ''
  const env = opts?.env ? formatEnv(opts.env) : []
  const volumes =
    opts.volumes?.reduce((acc: string[], vol) => {
      acc.push('-v', vol)
      return acc
    }, []) || []

  const logs = opts.dontStoreLogs
    ? []
    : ['--log-driver', 'k8s-file', '--log-opt', `path=$HOME/.bit-ship/logs/${opts.containerName}.log`]
  const platform = opts.platform ? ['--platform', opts.platform] : []
  const restart = opts.restart ? ['--restart', opts.restart] : []
  const rm = opts.remove ? ['--rm'] : []
  const ports =
    opts.ports?.reduce((acc: string[], port) => {
      acc.push('-p', port)
      return acc
    }, []) || []

  const detach = opts.detach ? ['--detach'] : ['--interactive', '--tty']
  const script = opts.script ? [...opts.script.split(' ')] : []
  const args = [
    'run',
    ...rm,
    ...name,
    '-w',
    '/app',
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

export interface ProcessOptions {
  onSpawn?: () => void
  onClose?: (code: number) => void
  detach?: boolean
}

export interface RunOptions {
  containerName: string
  detach?: boolean
  image: string
  script?: string
  dontStoreLogs?: boolean
  remove: boolean
  platform?: string
  ports?: string[]
  taskName?: string
  restart?: 'unless-stopped'
  volumes?: string[]
  env?: {
    [key: string]: string
  }
}

export interface StartOptions {
  detach?: boolean
  containerName: string
}
