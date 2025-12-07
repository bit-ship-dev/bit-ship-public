import consola from 'consola'
import { useStorage } from '@bit-ship/local-sdk'

export const setupSettingsModule = (program) => {
  program
    .command('settings')
    .description('Manage bit-ship settings')
    .action(async () => {
      const storage = useStorage()
      const option = await consola.prompt('What would you like to configure', {
        type: 'select',
        required: true,
        options: [
          { label: 'Crash report', value: 'crashreports', hint: 'We are using Sentry to collect crash reports' },
          { label: 'Reset settings', value: 'reset', hint: 'Delete all settings' }
        ]
      })

      // @ts-ignore
      if (option === 'reset') {
        await storage.clearAll()
        consola.success('All settings have been reset')
      }

      // @ts-ignore
      if (option === 'crashreports') {
        const state = await consola.prompt(
          'Crash reports - we are using Sentry.io for monitoring crashes for improving our products',
          {
            type: 'select',
            required: true,
            options: [
              { label: 'Enable', value: 'enable' },
              { label: 'Disable', value: 'disable' }
            ]
          }
        )
        // @ts-ignore
        if (state === 'enable') {
          await storage.isSentryDisabled.remove()
        }
        // @ts-ignore
        if (state === 'disable') {
          await storage.isSentryDisabled.set('true')
        }
        process.exit(0)
      }
    })
}
