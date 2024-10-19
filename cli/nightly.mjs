import {readFile, writeFile} from 'fs/promises';


const main = async () => {
  const packageJSON = JSON.parse(await readFile('package.json', 'utf-8'))
  console.log(packageJSON.version)
  packageJSON.version =  packageJSON.version + '-' + Date.now()

  await writeFile('package.json', JSON.stringify(packageJSON, null, 2))
}

main()
