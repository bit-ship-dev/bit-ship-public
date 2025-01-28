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
    description: 'Run your tasks'
  },
  args: {
    task: {
      description: 'Name of the task',
      type: 'positional',
      required: true,
    },
  },

  run({args}) {
    const taskName = args.task;
    const config =getConfig()
    // @ts-ignore
    const task = config?.tasks[taskName];
    // @ts-ignore
    const script = task?.script || '';
    if (!task || !script) {
      return consola.error(`Task '${taskName}' not found`);
    }

    const taskImage = task.image || 'default';
    // @ts-ignore
    const image = config.images[taskImage]?.name;

    if (!image) {
      return consola.error(`No image found for task '${task}'`);
    }
    consola.start('Running task')
    runContainer({containerName, image, script, volumes: ['./:/app']});
  },
});


export const exec=  defineCommand({
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

