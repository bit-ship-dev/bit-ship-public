import {parseYAML, stringifyYAML} from 'confbox';
import {readFile} from 'fs/promises';
import {writeFile} from 'unstorage/drivers/utils/node-fs';
import {ClientConfig} from './config.d'
import type {Config as ConfigType} from '@bit-ship/types/types/config'
import consola from 'consola';

const path = '.'
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

function setConfig(newConfig: ClientConfig){
  config = newConfig;
  writeFile(`${path}/bit-ship.yml`, stringifyYAML(newConfig));
}

async function loadConfig (){
  try {
    const configStr = await readFile(`${path}/bit-ship.yml`, 'utf8');
    config = parseYAML(configStr);
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
