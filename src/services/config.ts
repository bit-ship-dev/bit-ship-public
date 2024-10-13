import {parseYAML, stringifyYAML} from 'confbox';
import {readFile} from 'fs/promises';
import {writeFile} from 'unstorage/drivers/utils/node-fs';
import {ClientConfig} from './config.d'
import consola from 'consola';

const path = '.'
let config = {}

export const setupConfig = async() => {
  await loadConfig()
}


export const useConfig = () => ({
  getConfig: () => config,
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
  } catch (_err: any) {
    consola.warn('No bit-ship.yml file found. Create it with analyse command');
  }
}


