import fs from 'fs'
import {writeFile} from 'fs/promises'
import {useConfig} from '../../../services/config';
import consola from 'consola';

export const setupHook = async () => {
  const config = useConfig().getConfig()
  const path = '.git/hooks'
  if(!fs.existsSync(path)) {
    return consola.log('Git is not initialized')
  }

  if(config) {
    await writeFile(`${path}/pre-commit`, '#!/bin/sh\n\nbit-ship hook pre-commit')
    await writeFile(`${path}/post-commit`, '#!/bin/sh\n\nbit-ship hook post-commit')
  }
}
