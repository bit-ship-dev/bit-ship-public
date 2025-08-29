import { defineCommand, runMain } from 'citty';
import {setupConsola} from './services/consola';
import {setupConfig} from './services/config';
import {setupStorage} from './services/storage';
import {setupAnalytics} from './services/analytics';
import { fileURLToPath } from 'url';
import {readFile} from 'fs/promises'
import { dirname } from 'path';
import {setupHook} from './modules/run/services/hook';
import * as path from 'node:path';
import {restartDemon} from './modules/demon/demon';

async function init(){
  const version = await readVersion()
  await setupStorage(restartDemon);
  setupConsola();
  await setupAnalytics();
  await setupConfig();
  await setupHook()

  const main = defineCommand({
    meta: {
      name: 'bit-ship',
      version,
      description: 'Bit-Ship CLI https://www.bit-ship.dev',
    },
    subCommands: {
      init: () => import('./modules/init/init').then((r) => r.default),
      run:() => import('./modules/run/run').then((r) => r.run),
      stop:() => import('./modules/run/stop').then((r) => r.stop),
      exec:() => import('./modules/run/exec').then((r) => r.exec),
      demon: () => import('./modules/demon/demon').then((r) => r.default),
      image: () => import('./modules/image/image').then((r) => r.default),
      settings:() => import('./modules/settings/settings').then((r) => r.default),
      hook:() => import('./modules/run/hook').then((r) => r.hook),
    }
  });
  runMain(main);
}
init()

async function readVersion(): Promise<string> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // relative path from this file
  const packageJsonSTR = await readFile(path.join(__dirname, '..', 'package.json'), 'utf8');
  const packageJson = JSON.parse(packageJsonSTR);
  return packageJson.version || '0.0.0'
}
