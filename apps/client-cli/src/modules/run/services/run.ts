import { useContainer } from '../../../services/container'
import { type ClientConfig } from '@bit-ship/local-sdk'
import type { Handlers } from './run'

const { runContainer } = useContainer()

export const handlers: Handlers = {
  apps: handleApp,
  jobs: handleJob,
  tasks: handleTask
}

async function handleJob(name: string, config: ClientConfig, runOptions: any) {
  const handlers = config.jobs[name].tasks.map(
    (val: string | string[]) => () => {
      if (!Array.isArray(val)) {
        return handleTask(val, config, runOptions)
      }
      return Promise.all(val.map((taskName: string) => handleTask(taskName, config)))
    },
    []
  )
  handlers.forEach((handler) => handler())
}

async function handleApp(name: string, config: ClientConfig, runOptions: any) {
  const { expose, task } = config.apps[name]
  const ports: string[] = []
  if (expose) {
    expose.map((exp) => {
      if (exp.access === 'public' && exp.port) {
        ports.push(`${exp.port}:${exp.port}`)
      }
    })
  }

  handleTask(task, config, { ...runOptions, ports })
}

async function handleTask(taskName: string, config: ClientConfig, runOptions: any) {
  const task = config?.tasks[taskName]
  if (!task) {
    throw 'No task found for name: ' + taskName
  }
  const image = config?.images?.[task?.image || 'default']?.name
  if (!image) {
    throw 'No image found for name: ' + taskName
  }
  const script = task.command

  runContainer({ remove: true, taskName, image, env: task.env, script, volumes: ['./:/app'], ...runOptions })
}
