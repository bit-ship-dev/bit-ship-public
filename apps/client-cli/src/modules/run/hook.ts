import {defineCommand} from 'citty';
import {run} from './run';
import {useConfig} from '../../services/config';


const {getConfig} = useConfig();

export const hook = defineCommand({
  meta: {
    name: 'hook',
    description: 'Internal command used as entry point for the hooks',
  },
  args: {
    name: {
      type: 'string',
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
