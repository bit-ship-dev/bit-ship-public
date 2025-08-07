import {defineCommand} from 'citty';
import consola from 'consola';
import {useContainer} from '../../services/container';
import {useConfig} from '../../services/config';


const {runContainer} = useContainer();
const containerName = 'test';
const {getConfig} = useConfig();


export const exec = defineCommand({
  meta: {
    name: 'exec',
    description: 'Execute a command',
  },
  args: {
    command: {
      description: 'script to command',
      type: 'positional',
      required: false,
      alias: 'c',
      default: 'sh',
    },
    image: {
      type: 'string',
      required: false,
      alias: 'i',
      description: 'Image to use',
      default: 'default'
    }
  },
  async run({args}) {
    if(!args.image) {
      return consola.error('No image was provided and default image was not found');
    }
    const config = getConfig()
    const script = args.command
    const imageName = config.images[args.image].name
    await runContainer({remove: true, containerName, image: imageName, script, volumes: ['./:/app']});
  },
});
