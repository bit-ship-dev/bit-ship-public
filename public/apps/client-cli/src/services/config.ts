import {parseYAML, stringifyYAML} from 'confbox';
import {readFile, mkdir} from 'fs/promises';
import {writeFile} from 'unstorage/drivers/utils/node-fs';
import {ClientConfig} from './config.d'
import type {Config as ConfigType} from '@bit-ship/types/types/config'
import consola from 'consola';
import Joi from 'joi';

const path = '.bit-ship'
// eslint-disable-next-line
let config: Config | {} = {}

export const setupConfig = async() => {
  await loadConfig()
  // TODO update global hosts and proxy data
}


export const useConfig = () => ({
  getConfig: () => config,
  getConfigPath: (path: string | Array<string | number>, defaultValue: any) => get(config, path, defaultValue),
  setConfig,
  loadConfig
})

async function setConfig(newConfig: ClientConfig){
  consola.start('Updating bit-ship.yml');
  config = {...config, ...newConfig};
  await mkdir('path', { recursive: true });
  writeFile(`${path}/bit-ship.yml`, stringifyYAML(config));
}

async function loadConfig(){
  try {
    const configStr = await readFile(`${path}/bit-ship.yml`, 'utf8');
    config = parseYAML(configStr);
    const result = Config.validate(config)

    if(result.error) {
      consola.error('Invalid bit-ship.yml file', result.error)
      return
    }
    // eslint-disable-next-line sonarjs/no-ignored-exceptions
  } catch (_err: any) {
    consola.warn('No bit-ship.yml file found. You can create it manually or run `bit-ship init` to create a default one.');
  }
}

export type Config = ConfigType['1.0']



// ==================================== Helper

function get<T, K extends keyof T>(
  object: T,
  path: string | Array<string | number>,
  defaultValue?: any
): K extends string | number ? any : undefined {
  // Convert the path to an array if it's a string
  const pathArray: Array<string | number> = Array.isArray(path) ? path : path.match(/[^.[\]]+/g) || [];

  // Traverse the object using the path array
  const result = pathArray.reduce((accumulator: any, key: string | number) => {
    return (accumulator && accumulator[key as keyof typeof accumulator] !== undefined)
      ? accumulator[key as keyof typeof accumulator]
      : undefined;
  }, object);

  // Return the result or the default value if result is undefined
  return result === undefined ? defaultValue : result;
}


// ==================================== Validators
const Job = Joi.object({
  on: Joi.object({
    commit: Joi.object({
      on: Joi.string().valid('pre-commit', 'post-commit')
    })
  }),
  tasks: Joi.array().items(Joi.string()).required(),
})

const Task = Joi.object({
  script: Joi.string().required(),
  location: Joi.string().optional(),
  env: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  volumes: Joi.array().items(Joi.string()).optional(),
}).optional()

const Image = Joi.object({
  name: Joi.string().required(),
  build: Joi.string(),
  dependencies: Joi.object().optional(),
}).optional()

const App = Joi.object({
  expose: Joi.array().items(
    Joi.object({
      localHost: Joi.string().optional(),
      port: Joi.number(),
      access: Joi.string().valid('public', 'proxy-public', 'internal')
    })
  ).optional(),
  task: Joi.string().required(),
}).optional()

const Config = Joi.object({
  version: Joi.string().optional(),
  name: Joi.string().optional(),
  images: Joi.object().pattern(Joi.string(), Image).optional(),
  tasks: Joi.object().pattern(Joi.string(), Task).optional(),
  jobs: Joi.object().pattern(Joi.string(), Job).optional(),
  apps: Joi.object().pattern(Joi.string(), App).optional(),
  // vaults: Joi.object().optional(),
  // volumes: Joi.object().optional(),
})
