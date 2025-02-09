import {createStorage, type Storage} from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import consola from 'consola';
// @ts-ignore
import os from 'os';

// Get the home directory path
const homeDir = os.homedir();
let storage! : Storage

export const setupStorage = async () => {
  storage = await createStorage({
    driver: fsDriver({ base: `${homeDir}/.bit-ship/data` }),
  });
}

export const useStorage = (): Storage => {
  if (!storage)  {
    consola.error('Storage not initialized')
  }
  return storage
}




