import { defineCommand, runMain } from 'citty';
import {setupConsola} from './services/consola';
import {setupConfig} from './services/config';
import {setupStorage} from './services/storage';
import {setupAnalytics} from './services/analytics';
import {readFile} from 'fs/promises'

async function init(){
  const version = await readVersion()
  await setupStorage();
  setupConsola();
  setupAnalytics();
  setupConfig();

  const main = defineCommand({
    meta: {
      name: 'bit-ship',
      version,
      description: 'Bit-Ship CLI https://bit-ship.dev/',
    },
    subCommands: {
      analyse: () => import('./modules/analyse/analyse').then((r) => r.default),
      run:() => import('./modules/run/run').then((r) => r.run),
      exec:() => import('./modules/run/run').then((r) => r.exec),
      settings:() => import('./modules/settings/settings').then((r) => r.default),
    }
  });
  runMain(main);
}
init()


async function readVersion(): Promise<string> {
  const packageJsonSTR = await readFile('./package.json', 'utf8');
  const packageJson = JSON.parse(packageJsonSTR);
  return packageJson.version || '0.0.0'
}
