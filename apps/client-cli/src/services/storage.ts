import {createStorage, type Storage} from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';
import consola from 'consola';
// @ts-ignore
import os from 'os';

// Get the home directory path
const homeDir = os.homedir();
let storage! : Storage

export const setupStorage = async (restartDemon: () => Promise<any>) => {
  storage = await createStorage({
    driver: fsDriver({ base: `${homeDir}/.bit-ship/data` }),
  });

  let projects = await storage.getItem('projects')
  if(!projects) {
    projects = {}
  }
  if (!projects[process.cwd()]) {
    projects[process.cwd()] = ''+Date.now()
    await storage.setItem('projects', projects)
    restartDemon()
  }
}

export const useStorage = (): Storage => {
  if (!storage)  {
    consola.error('Storage not initialized')
  }
  return storage
}
