import consola from 'consola';
import {defineCommand} from 'citty';
import {useContainer} from '../../services/container';
import {useConfig} from '../../services/config';
import {type ClientConfig} from '../../services/config.d';
import type {Handlers} from './run.d'
import {getContainerName, resolveRawName} from './utils/naming';

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
    detach: {
      description: 'Run in background in detached mode',
      alias: 'd',
      type: 'boolean',
    },
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

    const runOptions: any = {
      detach: !!args.detach,
      silentLog: !!args.detach,
      onSpawn: args.detach ? () => {
        consola.success('Process Started')
      }: undefined
    }

    await Promise.all(names.map((name) => {
      handlers[category](name, config, {...runOptions, containerName: getContainerName(category, name) })
    }))

  },
});

async function handleJob(name: string, config: ClientConfig, runOptions: any) {
  const handlers = config.jobs[name].tasks.map((val: string | string[]) =>
    () => {
      if(!Array.isArray(val)) {
        return handleTask(val, config, runOptions)
      }
      return Promise.all(val.map((taskName: string) => handleTask(taskName, config)))
    }, [])
  handlers.forEach((handler) => handler())
}

async function handleApp(name: string, config: ClientConfig, runOptions: any) {
  const {expose, task} = config.apps[name];
  const ports: string[]  = []
  if(expose) {
    expose.map((exp) => {
      if (exp.access === 'public' && exp.port) {
        ports.push(`${exp.port}:${exp.port}`)
      }
    })
  }

  handleTask(task, config, {...runOptions, ports})
}

async function handleTask(taskName: string, config: ClientConfig, runOptions: any) {
  const task = config?.tasks[taskName];
  if (!task) {
    throw 'No task found for name: ' + taskName
  }
  const image = config?.images?.[task?.image || 'default']?.name
  if (!image) {
    throw 'No image found for name: ' + taskName
  }
  runContainer({remove: true, taskName, image,env: task.env, script: task.script, volumes: ['./:/app'], storeLogs: true, ...runOptions});
}


