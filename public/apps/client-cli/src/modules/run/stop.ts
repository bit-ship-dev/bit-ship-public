import consola from 'consola';
import {defineCommand} from 'citty';
import {useContainer} from '../../services/container';
import {useConfig} from '../../services/config';
import {getContainerName, resolveRawName} from './utils/naming';

const {stopContainer} = useContainer();
const {getConfig} = useConfig();

export const stop = defineCommand({
  meta: {
    name: 'stop',
    description: 'Stop tasks, jobs and apps',
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
    await Promise.all(names.map((name) => {
      stopContainer(getContainerName(category, name))
    }))
  },
});
