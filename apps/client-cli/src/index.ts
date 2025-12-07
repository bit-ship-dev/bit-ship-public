import { Command } from 'commander'
import { setupConsola } from './services/consola'
import { setupConfig, setupStorage } from '@bit-ship/local-sdk'
import { setupAnalytics } from './services/analytics'
import { setupInitModule } from './modules/init'
import { setupRunModule } from './modules/run'
import { setupDemonModule } from './modules/demon'
import { setupImageModule } from './modules/image'
import { setupSettingsModule } from './modules/settings'
import { readVersion } from './utils/cli'
import { setupProject } from './services/project'

export async function init() {
  //=================> Core
  const version = await readVersion()
  await setupStorage()
  setupConsola()
  await setupAnalytics()
  await setupConfig()
  await setupProject()
  const program = new Command()
  program.name('bit-ship').description('Bit-Ship CLI https://www.bit-ship.dev').version(version)
  program.addHelpText('after', '\nCommands docs: https://www.bit-ship.dev/docs/cli/commands')

  //===================================> Modules
  setupInitModule(program)
  setupRunModule(program)
  setupImageModule(program)
  setupDemonModule(program)
  setupSettingsModule(program)
  program.parse()
}
