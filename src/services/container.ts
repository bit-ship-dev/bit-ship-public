import {spawn} from 'child_process';
import consola from 'consola';
// import chalk from "chalk";


export const useContainer = () => ({
  runContainer
})

const runContainer = async (opts: RunOptions) => new Promise((resolve) => {
  const name = opts.containerName? ['--name', opts.containerName] : ''
  const env = opts?.env ? ['-e', ...formatEnv(opts.env)]: []
  const volumes = opts?.volumes ?  ['-v', ...opts.volumes] : []

  const args = [
    'run', '--rm', ...name,
    '-w', '/app', ...env, ...volumes,
    opts.image, ...opts.script.split(' ')
  ]
  const process = spawn('docker', args);

  const log = opts.detouched ?
    (_output: any) => {} :
    (output: any, type: 'log' | 'error' | 'success' | 'start') => {
      consola[type](output)
    }

  log('-------------------------- Running task', 'start')
  process.stdout.on('data', (data: any) => log(`${data}`, 'log'));
  process.stderr.on('data', (data: any) => log(`${data}`,'log'));
  process.on('close', (code: any) => {
    resolve(true)
    log(`--------------------------/ Task finished code: ${code}`, 'success')
  });
})



function formatEnv(env: any) {
  return Object.entries(env).map(([key, value]) => `${key}=${value}`)
}

interface RunOptions {
  containerName: string;
  image: string;
  script: string;
  detouched?: boolean;
  ports?: string[];
  volumes?: string[];
  env?: {
    [key: string]: string
  }
}
