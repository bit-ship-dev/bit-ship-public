import consola from 'consola';
import {defineCommand} from 'citty';
// import {useContainer} from '../../services/container';
import {useStorage} from '../../services/storage';

export default defineCommand({
  meta: {
    name: 'settings',
    description: 'Configure bit-ship cli'
  },
  args: {
    section: {
      description: 'Analytics',
      type: 'positional',
      required: false,
    },
  },
  async run() {

    const storage = useStorage()


    const option = await consola.prompt('What would you like to configure', {
      type: 'select',
      required: true,
      options: [
        {label: 'Crash report', value: 'crashreports', hint: 'We are using Sentry to collect crash reports'},
        {label: 'Reset settings', value: 'reset', hint: 'Delete all settings'},
      ],
    });
    // @ts-ignore
    if(option === 'crashreports') {
      const state = await consola.prompt('Crash reports - we are using Sentry.io for monitoring crashes for improving our products', {
        type: 'select',
        required: true,
        options:[
          {label: 'Enable', value: 'enable'},
          {label: 'Disable', value: 'disable'}
        ]
      })
      // @ts-ignore
      if(state === 'enable') {
        await storage.removeItem('isSentryDisabled')
      }
      // @ts-ignore
      if(state === 'disable') {
        await storage.setItem('isSentryDisabled', 'true')
      }

    }

  },
});
