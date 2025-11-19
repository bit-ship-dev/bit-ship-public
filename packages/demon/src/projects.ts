import { glob } from 'glob';
import { parseYAML } from 'confbox';
import { readFile } from 'fs/promises';
import { exec } from 'child_process'

let data: Info = {
  version: '1.0.0',
  projects: {}
}
export async function setupData() {
  data.projects = await readProjects()
}

export async function readProjects() {
  const folder = await glob('/projects/*/.bit-ship', {})
  const raw = await Promise.all(folder.map(async (folder) => {
    let gitOrigin = ''
    try {
      gitOrigin = await execAsync('git remote get-url origin', { cwd: folder })
    } catch (err) {
      gitOrigin = '-------'
    }

    console.log('=====>', gitOrigin)
    const config = parseYAML(await readFile(folder + '/bit-ship.yml', 'utf-8'))
    return { key: gitOrigin, val: { config } }
  }))

  return raw.reduce((acc, item) => {
    acc[item.key] = item.val
    return acc
  }, {})
}


export const getProjectInfo = (): Info => data


export const execAsync = (command, options): Promise<string> => new Promise((resolve, reject) => {
  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      reject(error);
      return;
    }
    resolve("" + stdout);
  });
});




interface Info {
  version: string;
  projects: {
    [gitOrigin: string]: {

      name: string;
      apps: {};
      jobs: {};
      logs: {};
      vaults: {};
      images: {};
    };
  }
}
