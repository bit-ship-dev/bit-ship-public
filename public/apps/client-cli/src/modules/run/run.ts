import consola from 'consola';
import {defineCommand} from 'citty';
import {useContainer} from '../../services/container';
import {useConfig} from '../../services/config';
import {type ClientConfig} from '../../services/config.d';
import type {Handlers, ParsedName, Categories} from './run.d'

const {runContainer} = useContainer();
const {getConfig} = useConfig();


const handlers: Handlers = {
  apps: handleApp,
  jobs: handleJob,
  tasks: handleTask,
}

export const run = defineCommand({
  meta: {
    name: 'run',
    description: 'Run tasks, jobs and apps',
  },
  args: {
    name: {
      description: 'Name of tasks, jobs and apps',
      type: 'positional',
      required: true,
    },
  },
  async run({args}) {
    const rawName = args.name;
    const config = getConfig()
    const {category, names} = resolveRawName(rawName, config)
    if (!config) {
      return consola.log('No config found');
    }
    if (!category || !names.length) {
      return consola.error(`No task, job or app found with name '${rawName}'`);
    }
    await Promise.all(names.map((name) => handlers[category](name, config)))

  },
});

async function handleJob(name: string, config: ClientConfig) {
  const handlers = config.jobs[name].tasks.map((val: string | string[]) =>
    () => {
      if(!Array.isArray(val)) {
        return handleTask(val, config)
      }
      return Promise.all(val.map((taskName: string) => handleTask(taskName, config)))
    }, [])
  handlers.forEach((handler) => handler())
}

async function handleApp(name: string, config: ClientConfig) {
  const {expose, task} = config.apps[name];
  const containerName = `bit-app-${name}`
  const ports: string[]  = []
  if(expose) {
    expose.map((exp) => {
      if (exp.access === 'public' && exp.port) {
        ports.push(`${exp.port}:${exp.port}`)
      }
    })
  }
  handleTask(task, config, {containerName, ports})
}

async function handleTask(taskName: string, config: ClientConfig, runOptions?: any) {
  const task = config?.tasks[taskName];
  if (!task) {
    throw 'No task found for name: ' + taskName
  }
  const image = config?.images?.[task?.image || 'default']?.name
  if (!image) {
    throw 'No image found for name: ' + taskName
  }
  const containerName = `bit-${taskName}-${Date.now()}`
  runContainer({remove: true, taskName, containerName, image, script: task.script, volumes: ['./:/app'], storeLogs: true, ...runOptions});
}


// ================================> Helpers
const resolveRawName = (rawName: string, config: ClientConfig): ParsedName => {
  const categories: Categories[]  = ['jobs', 'apps', 'tasks']
  const  category =
    // Prefix Match
    categories.find((category) =>
      rawName.startsWith(`${category}:`) && config[category][rawName.replace(`${category}:`, '')]) ||
    //Item Match
    categories.find((category) => config?.[category]?.[rawName])
  const wildCardCategory = categories.find((cat) => cat === rawName)

  let names: string[] = []
  if (category) {
    names.push(rawName.replace(category+':', ''))
  } else if (wildCardCategory) {
    names = Object.keys(config[wildCardCategory])
  }

  return  { names, category: category || wildCardCategory }
}


