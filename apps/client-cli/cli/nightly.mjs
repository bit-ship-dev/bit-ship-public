import {readFile, writeFile} from 'fs/promises';
import {exec} from 'child_process';

const main = async () => {
  try {
    // Update Package.json
    const out = await execProm('git rev-parse --short HEAD')
    const packageJSON = JSON.parse(await readFile('package.json', 'utf-8'))
    const commitHash = out.split('\n')[0];
    packageJSON.version =  `${packageJSON.version}-${commitHash}`
    delete packageJSON.scripts
    await writeFile('package.json', JSON.stringify(packageJSON, null, 2))
    // Update Package.json
    const tag = `client-cli-${commitHash}`
    await execProm(`git tag ${tag} && git push --force origin ${tag}`)
  } catch (error){
    console.error(error)
  }
}

const execProm = (command) => new Promise((resolve, reject) => {
  exec(command, async (err, stdout, stderr) => {
    if (err) {
      return reject(err)
    }
    resolve(stdout)
  })
})
main()
