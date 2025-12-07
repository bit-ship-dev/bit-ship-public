import consola from 'consola'
import type { Report } from '@bit-ship/types/types/index.d'
import { useConfig } from '@bit-ship/local-sdk'
import { ClientConfig } from '@bit-ship/local-sdk'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { readFile, unlink } from 'fs/promises'
import { useImage } from '../../services/images'
import { setupProject } from '../../services/project'

export const setupInitModule = (program) => {
  const { setConfig } = useConfig()

  const { create: createImage } = useImage()

  program
    .command('init')
    .description('Initialize bit-ship in your project')
    .action(async () => {
      const report: Report['1.0'] = await getReport()
      consola.success('Analysis completed')
      const tasks = await initTasks(report)
      try {
        const image = await createImage(report.dependencies)
        await setConfig({
          version: '1.0',
          tasks,
          images: { default: image },
          volumes: {
            default: {
              fs: ['./:/app']
            }
          }
        })
        setupProject()
      } catch (error) {
        consola.error('Error')
        consola.error(
          'Please report this issue to https://discord.com/channels/1260997714049630268/1325444528546643979'
        )
        consola.log(error)
      }
      process.exit(0)
    })
}

async function initTasks(report: AnalyserReport): Promise<ClientConfig['tasks']> {
  consola.box('Command Configuration \nLeave empty if not applicable')
  const tasks: ClientConfig['tasks'] = {}
  for (const taskName in report.tasks) {
    report.tasks[taskName].sort(highToLow)
    const script = await consola.prompt(prompts[taskName], {
      initial: report.tasks[taskName]?.[0]?.script || ''
    })
    if (script) {
      tasks[taskName] = { command: script }
    }
  }
  return tasks
}

async function getReport(): Promise<Report['1.0']> {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const reportPath = './tmp_report.json'
  return new Promise((resolve, _reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(`node ${__dirname}/analyser-cli.js`, { cwd: process.cwd() }, (error, _stdout, _stderr) => {
      if (error) {
        return consola.error('Analysis failed', error)
      }
      readFile(reportPath, 'utf-8').then((data) => {
        unlink(reportPath)
        resolve(JSON.parse(data))
      })
    })
  })
}

const highToLow = (a: any, b: any) => b.value - a.value

const prompts = {
  build: 'Build command -> What command do you use to build your project?',
  setup: 'Setup command -> What you need to run after pulling repo?',
  dev: 'Dev command -> What command do you use to run your project in dev mode?',
  start: 'Start -> What command do you use to start your project in production?',
  qa: 'QA command -> What command do you use to run your project in QA mode?'
}
