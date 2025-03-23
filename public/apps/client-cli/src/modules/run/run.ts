import consola from 'consola';
import {defineCommand} from 'citty';
import {useContainer} from '../../services/container';
import {useConfig} from '../../services/config';


const {runContainer} = useContainer();
const containerName = 'test';
const {getConfig} = useConfig();


export const run = defineCommand({
  meta: {
    name: 'run',
    description: 'Run your tasks and jobs'
  },
  args: {
    task: {
      description: 'Name of the task or job',
      type: 'positional',
      required: true,
    },
  },
  run({args}) {
    const name = args.task;
    const taskExec = handleTask(name)
    if (taskExec) {
      return taskExec();
    }
    const jobExec = handleJob(name)
    if (jobExec){
      jobExec()
    }
  },
});


export const exec = defineCommand({
  meta: {
    name: 'exec',
    description: 'Execute a script',
  },
  args: {
    script: {
      description: 'script to execute',
      type: 'positional',
      required: true,
    },
    image: {
      type: 'string',
      required: false,
      description: 'Image to use',
      default: 'default'
    }
  },
  async run({args}) {
    if(!args.image) {
      return consola.error('No image was provided and default image was not found');
    }
    const config = getConfig()
    const script = args.script;
    const imageName = config.images[args.image].name
    await runContainer({containerName, image: imageName, script, volumes: ['./:/app']});
  },
});



export const hook = defineCommand({
  meta: {
    name: 'hook',
    description: 'Internal command used as entry point for the hooks',
  },
  args: {
    name: {
      type: 'string',
      description: 'hook ',
      required: true,
    }
  },
  async run({args}) {
    const config = getConfig()

    // @ts-ignore
    if(!config.jobs) {
      return
    }

    // @ts-ignore
    for(const job in config.jobs) {
      // @ts-ignore
      if(config.jobs[job]?.on?.commit?.on === args.name) {
        // @ts-ignore
        run.run({args: {task: job}})
      }
    }

  },
});



function handleJob(jobName: string): Handler | undefined {
  const config = getConfig()
  const job = config?.jobs[jobName];
  const task = job.tasks

  if (!job ) {
    consola.error(`Job '${jobName}' not found`);
    return
  }

  const handlers = task.reduce((acc: any[], taskName: string) => {
    const exec = handleTask(taskName)
    if (exec) {
      acc.push(exec)
    }
    return acc
  }, [])

  if (!handlers.length) {
    consola.error('Job does not include any valid tasks');
    return
  }

  return () => {
    consola.log(`Running job ${jobName} with ${task.length} tasks`)
    handlers.forEach((handler: Handler) => handler())
  }

}



function handleTask(taskName: string): Handler | undefined {
  const config = getConfig()
  const task = config?.tasks[taskName];
  // @ts-ignore
  const script = task?.script || '';

  if (!task) {
    return
  }
  const taskImage = task.image || 'default';
  // @ts-ignore
  const image = config.images[taskImage]?.name;

  if (!image) {
    return consola.error(`No image found for task '${task}'`);
  }

  return () => {
    runContainer({taskName,containerName, image, script, volumes: ['./:/app'], storeLogs: true});
  }

}



type Handler = () => void
