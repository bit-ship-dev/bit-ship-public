import { useEnvironment } from '../../services/environment'
import { stop, start, restart } from './utils/demon'

export const setupDemonModule = (program) => {
  if (useEnvironment().env.newProject) {
    restart()
  }

  const demon = program.command('demon').description('Manage bit-ship demon')
  demon
    .command('start')
    .description('Start the demon')
    .action(async () => {
      await start()
      process.exit(0)
    })
  demon
    .command('stop')
    .description('stop the demon')
    .action(async () => {
      await stop()
      process.exit(0)
    })
  demon
    .command('restart')
    .description('Restart the demon')
    .action(async () => {
      await restart()
      process.exit(0)
    })
}
