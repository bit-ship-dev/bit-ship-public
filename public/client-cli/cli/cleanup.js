import {readFile, writeFile} from 'fs/promises';
import {exec} from 'child_process';

const main = async () => {
  const packageJSON = JSON.parse(await readFile('package.json', 'utf-8'))
  packageJSON.devDependencies = {}
  await writeFile('package.json', JSON.stringify(packageJSON, null, 2))
}

main()
