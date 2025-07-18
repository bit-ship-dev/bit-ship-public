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
    description: 'Execute a script',
  },
  args: {
    script: {
      description: 'script to execute',
      type: 'positional',
      required: false,
      default: 'sh',
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
    const script = args.script
    const imageName = config.images[args.image].name
    await runContainer({remove: true, containerName, image: imageName, script, volumes: ['./:/app']});
  },
});
