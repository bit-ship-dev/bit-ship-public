import {exec} from 'child_process'
import {consola} from 'consola';

export const loadRepo = (repoUrl: string, targetPath: string): Promise<void> => new Promise((res, rej) => {
  consola.start(`Cloning repo ${repoUrl}`)

  //eslint-disable-next-line sonarjs/os-command
  exec(`git clone ${repoUrl} ${targetPath}`, (error, stdout, stderr) => {
    if (error) {
      return rej(stderr)
    }
    consola.success('Cloning finished')
    res()
  })
})
