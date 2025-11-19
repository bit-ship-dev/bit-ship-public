import { setupProjects } from './projects'
import { setupProxy } from './modules/proxy';
import { setupAPI } from './modules/api';

import { setupStorage } from '@bit-ship/local-sdk'


const main = async () => {
  await setupStorage('/.bit-ship/data')
  await setupProjects()

  setupProxy()
  setupAPI()
}
main()
