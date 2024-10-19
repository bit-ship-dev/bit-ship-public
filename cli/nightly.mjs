import {readFile, writeFile} from 'fs/promises';
import {exec} from 'child_process';

const main = async () => {
  const packageJSON = JSON.parse(await readFile('package.json', 'utf-8'))
  exec('git rev-parse HEAD', async (err, stdout, stderr) => {
    const commitHash = stdout.split('\n')[0];
    packageJSON.version =  packageJSON.version + '-' + commitHash
    await writeFile('package.json', JSON.stringify(packageJSON, null, 2))
  })
}

main()
