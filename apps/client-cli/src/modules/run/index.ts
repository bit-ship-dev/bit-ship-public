import { useConfig } from '@bit-ship/local-sdk'
import { setupHook } from './services/hook'
import consola from 'consola'
import { getContainerName, resolveRawName } from './utils/naming'
import { useContainer } from '../../services/container'
import { handlers } from './services/run'

// eslint-disable-next-line
export const setupRunModule = (program) => {
  const { getConfig } = useConfig()
  const config = getConfig()
  setupHook()

  const { stopContainer, runContainer } = useContainer()

  program
    .command('run')
    .description('Run bit-ship')
    .option('-d, --detach <char>')
    .argument('<name>')
    .action(
      async (name, opts) => {
        const rawName = name
        const config = getConfig()
        const { category, names } = resolveRawName(rawName, config)
        if (!config) {
          return consola.log('No config found')
        }
        if (!category || !names.length) {
          return consola.error(`No task, job or app found with name '${rawName}'`)
        }

        const runOptions: any = {
          detach: !!opts.detach,
          silentLog: !!opts.detach,
          onSpawn: opts.detach
            ? () => {
              consola.success('Process Started')
            }
            : undefined
        }

        await Promise.all(
          names.map((_name) => {
            handlers[category](_name, config, { ...runOptions, containerName: getContainerName(category, _name) })
          })
        )
        process.exit(0)
      },

      program
        .command('stop')
        .argument('<name>')
        .description('Stop tasks, jobs and apps')
        .action(async (name: string) => {
          consola.start(`Stopping '${name}'`)
          const rawName = name
          const { category, names } = resolveRawName(rawName, config)
          if (!config) {
            return consola.log('No config found')
          }
          if (!category || !names.length) {
            return consola.error(`No task, job or app found with name '${rawName}'`)
          }
          await Promise.all(
            names.map((_name) => {
              stopContainer(getContainerName(category, _name))
            })
          )
          process.exit(0)
        })
    )

  program
    .command('exec')
    .description('Execute bit-ship command')
    .option('-i, --image <image-name>', 'Image to use')
    .argument('<command>')
    .action(async (command, opts) => {
      if (!opts.image) {
        return consola.error('No image was provided and default image was not found')
      }
      const script = command
      const imageName = config.images[args.image].name
      await runContainer({ remove: true, containerName, image: imageName, script, volumes: ['./:/app'] })
      process.exit(0)
    })

  program
    .command('hook')
    .argument('<name>')
    .description('! Internal Job !')
    .action(async (name: string) => {
      if (!config.jobs) {
        return
      }
      for (const job in config.jobs) {
        if (config.jobs[job]?.on?.commit?.on === name) {
          run.run({ args: { task: job } })
        }
      }
      process.exit(0)
    })
}
