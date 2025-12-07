import type {DefaultTasks, ToolNames} from '@bit-ship/types/types/index.d';
import {AnalyserReport} from '../types';
const dependencies: AnalyserReport['dependencies'] = {}

const tasks: AnalyserReport['tasks'] = {
  start: [],
  dev: [],
  build: [],
  qa: []
}


export const addDependency = (name: ToolNames, value: AnalyserReport['dependencies']['1']): void => {
  dependencies[name] = value
}

export const addScript = (taskName: DefaultTasks, task: AnalyserReport['tasks']['dev']['1']) => {
  // @ts-ignore
  tasks[taskName].push(task)
}



export async function getReport() {
  const report = {
    version: '1.0',
    tasks,
    dependencies,
  }
  return report
}

