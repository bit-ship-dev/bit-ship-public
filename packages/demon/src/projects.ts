import {glob} from 'glob';
import {parseYAML} from 'confbox';
import {readFile} from 'fs/promises';

export async function readProjects(){
  const files = await glob('/projects/*/.bit-ship/bit-ship.yml', {})
  console.log('====>bit-ship files', files)
  return await Promise.all(files.map(async (file) =>
    parseYAML(await readFile(file,'utf-8'))
  ))
}

//======================> Helpers
export const  getLocations = (projects: any[])  =>
  projects.reduce((acc, project) => {
    if(project.apps) {
      Object.entries(project.apps).forEach(([name, app]) => {
        if(app && Array.isArray(app.expose)) {
          app.expose.forEach((expose) => {
            if (expose.localHost) {
              acc[expose.localHost] = {...expose, containerName: 'bit-app-'+name}
            }
          });
        }
      })
    }
    return acc
  }, {})

export const getApps = (projects: any[]) =>
  projects.reduce((acc, project) => {
    if(project.apps) {
      Object.keys(project.apps).forEach((app) => {
        if(app) {
          acc[app] = project.apps[app]
        }
      })
    }
    return acc
  }, {})
