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

async function loadConfig (){
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
    consola.warn('No bit-ship.yml file found. Create it with analyse command');
  }
}

export type Config = ConfigType['1.0']

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
  }).required(),
  tasks: Joi.array().items(Joi.string()).required(),
})

const Task = Joi.object({
  script: Joi.string().required(),
  location: Joi.string().optional(),
  env: Joi.object().optional(),
  volumes: Joi.array().items(Joi.string()).optional(),
}).optional()

const Image = Joi.object({
  name: Joi.string().required(),
  dependencies: Joi.object().optional(),
}).optional()

const Config = Joi.object({
  version: Joi.string().optional(),
  name: Joi.string().optional(),
  images: Joi.object({}).pattern(Joi.string(), Image).optional(),
  tasks: Joi.object({}).pattern(Joi.string(), Task).optional(),
  jobs: Joi.object().pattern(Joi.string(), Job).optional(),
  // vaults: Joi.object().optional(),
  // apps: Joi.object().optional(),
  // volumes: Joi.object().optional(),
})
