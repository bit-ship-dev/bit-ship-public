import {commandNames, dependencies} from './config';
import {DependencyCategory} from './config.d';
import {consola} from 'consola';
import {addScript} from '../../services/report';
import {DefaultTasks} from '@bit-ship/types/types/index.d';



export const analyseScripts = (packageJson: any, location: string) => {
  if(!packageJson.scripts) {
    consola.warn('No scripts found in package.json')
  }
  getBuildScripts(packageJson, location)
  getQAScripts(packageJson, location)
}


// ===============>NameSearch
function getBuildScripts(packageJson: any, location: string) {
  for(const category in commandNames) {
    Object.keys(packageJson.scripts).forEach((scriptName) => {

      const value = evalName(scriptName, (category as DefaultTasks))


      if(value > 0) {
        // @ts-ignore
        addScript(category, {script: `npm run ${scriptName}`, value, location, flags: {}})
      }
    })
  }
}

function evalName(scriptName: string, category: DefaultTasks): number {
  // @ts-ignore
  const {actions, modes} = commandNames[category]

  const highestAction = Object.keys(actions).reduce((acc, name) =>
    scriptName.includes(name) && (acc.value < actions[name].value) ? actions[name] : acc,
  {value: 0}
  )
  const highestMode = Object.keys(modes).reduce((acc, name) =>
    scriptName.includes(name) && (acc.value < modes[name].value) ? modes[name] : acc,
  {value: 0}
  )
  return highestAction.value + highestMode.value
}




// ===============>DependencySearch
const getQAScripts = (packageJson: any, location: string) => {
  const projectDependencies = {
    ...packageJson.peerDependencies,
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  }
  const dependencyCategories: DefaultTasks[] = (Object.keys(dependencies) as DefaultTasks[])

  dependencyCategories.forEach((categoryKey: DefaultTasks) => {
    // @ts-ignore
    const category: DependencyCategory = dependencies[categoryKey]

    Object.keys(category).forEach((tool) => {


      if(projectDependencies[tool] && category[tool]) {
        const {commandPattern, value} = category[tool]
        addScript(categoryKey, {script: commandPattern, location, value: value})
      }
    })


  })

}


