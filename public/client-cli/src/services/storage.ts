import {createStorage, type Storage} from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import consola from 'consola';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import {useAnalytics} from './analytics';

const {capture} = useAnalytics()
// Get the home directory path
const homeDir = os.homedir();
let storage! : Storage

export const setupStorage = async () => {
  storage = createStorage({
    driver: fsDriver({ base: `${homeDir}/.bit-ship` }),
  });
  const date = await storage.getItem('lastUsageDate')
  if (date) {
    install()
  }
  await storage.setItem('lastUsageDate', new Date().toISOString())
}

export const useStorage = (): Storage => {
  if (!storage)  {
    consola.error('Storage not initialized')
  }
  return storage
}



async function install(){
  const uuid = uuidv4();
  storage.setItem('uuid', uuidv4());
  capture('install', {uuid});
}
