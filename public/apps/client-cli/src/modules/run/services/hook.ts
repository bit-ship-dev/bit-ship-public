import fs from 'fs'
import {writeFile} from 'fs/promises'
import {useConfig} from '../../../services/config';

export const setupHook = async () => {
  const config = useConfig().getConfig()
  const path = '.git/hooks'
  if(!fs.existsSync(path)) { // Git not initialized
    return
  }

  if(config) {
    await writeFile(`${path}/pre-commit`, '#!/bin/sh\n\nbit-ship hook --name=pre-commit')
    await writeFile(`${path}/post-commit`, '#!/bin/sh\n\nbit-ship hook --name=post-commit')
  }
}
