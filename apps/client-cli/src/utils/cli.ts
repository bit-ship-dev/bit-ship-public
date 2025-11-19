import chalk from 'chalk';
import { fileURLToPath } from 'url';
import {readFile} from 'fs/promises'
import { dirname } from 'path';
import * as path from 'node:path';

export const loader = (message: () => string): () => void => {
  const P = ['◐', '◓', '◑', '◒'];
  let x = 0;
  const interval = setInterval(() => {
    process.stdout.write(chalk.magenta(`\r${P[x++]} ${message()}`));
    x &= 3;
  }, 250);
  return () => {
    clearInterval(interval)
  }
}



export async function readVersion(): Promise<string> {
  const pkgPath = path.join(dirname(fileURLToPath(import.meta.url)), '../package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
  return pkg.version ?? '0.0.0';
}
