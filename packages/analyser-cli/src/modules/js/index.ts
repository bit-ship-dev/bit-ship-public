import {glob} from 'glob';
//@ts-ignore
import {readFile} from 'fs/promises'
import {analyseDependencies} from './dependencies';
import {consola} from 'consola';
import {analyseScripts} from './scripts'



export const analyseJs = async (repoPath: string): Promise<void> => {
  try {
    consola.start('Analyzing JS')
    const files= await glob(`${repoPath}/**/package.json`, { ignore: 'node_modules/**' });
    if(files.length === 0) {
      return consola.warn('No package.json found')
    }

    const packageJson = await readPackageJson(files[0])

    analyseDependencies(packageJson, '/')
    analyseScripts(packageJson, '/')

  } catch (error) {
    consola.error(error)
  }
}

const readPackageJson = async (packageJsonPath: string): Promise<any> => {
  const packageJsonRaw: string = await readFile(packageJsonPath, 'utf-8')
  return JSON.parse(packageJsonRaw)
}
