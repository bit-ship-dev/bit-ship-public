import consola from 'consola';
import {defineCommand} from 'citty';
import {useContainer} from '../../services/container';
import {useConfig} from '../../services/config';


const {runContainer} = useContainer();
const containerName = 'test';
const image = 'node:22-alpine'
const {getConfigPath} = useConfig();


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
    const task = getConfigPath(['tasks', taskName], undefined);
    // @ts-ignore
    const script = task?.script || '';
    if (!task || !script) {
      return consola.error(`Task '${taskName}' not found`);
    }
    const image = getConfigPath(['tasks', taskName, 'image'], '') || getConfigPath(['config', 'images', 'default'], '')
    if (!image) {
      return consola.error(`No image found for task '${task}'`);
    }
    consola.start('Running task')
    runContainer({containerName, image, script});
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
      default: getConfigPath(['images', 'default'], '')
    }
  },
  async run({args}) {
    if(!args.image) {
      return consola.error('No image was provided and default image was not found');
    }
    const script = args.script;
    await runContainer({containerName, image, script});
  },
});

