import { parseYAML } from 'confbox'
import { readFile } from 'fs/promises'
// import { exec } from 'child_process'
import { log } from 'isomorphic-git'
import * as fs from 'fs'
import { useStorage } from '@bit-ship/local-sdk'

const projects: Projects = {}

export async function setupProjects() {
  console.log('==========>getting projects')
  const { state } = useStorage()
  const projectsRAW = await state.projects.getAll()
  console.log('==========>projects', projectsRAW)

  Object.keys(projectsRAW).forEach(async (id) => {
    try {
      const config = await getConfig(idToPath(id))
      projects[id] = {
        gitOrigin: projectsRAW.gitOrigin,
        name: config.name
      }
      console.log('=======>loaded', projects[id])
    } catch (err) {
      console.error('Cant read project ' + id, err)
    }
  })
}

export const useProjects = () => {
  return {
    getProjects: (): Projects => projects,
    getProjectDetail: async (projectId: string): Promise<ProjectDetail> => {
      const { state } = useStorage()
      console.log('========<>project', state.projects)
      const info = await state.projects.findOne(projectId).get()

      const config = await getConfig(idToPath(projectId))

      return { info, config }
    },
    getCommits: (projectId: string): Promise<ProjectCommits> => {
      return getCommits(idToPath(projectId))
    }
  }
}

const idToPath = (id: string) => `/projects/${id}`

async function getConfig(folder: string): Promise<ProjectConfig> {
  const file = await readFile(folder + '/.bit-ship/bit-ship.yml', 'utf-8')
  return parseYAML(file)
}

async function getCommits(folder: string): Promise<ProjectCommits> {
  try {
    const commits = await log({ fs, dir: folder, depth: 100 })
    return commits.map((commit) => ({
      hash: commit.oid,
      author: commit.commit.author.name,
      date: commit.commit.author.timestamp * 1000,
      message: commit.commit.message
    }))
  } catch (err) {
    console.error(err)
  }
  return []
}

// =============================================>Typing
interface Projects {
  [id: string]: {
    gitOrigin: string
    name: string
  }
}

interface ProjectDetail {
  info: {
    gitOrigin: string
    pathInHostMachine: string

    jobs: {
      [key: string]: {
        commits: {
          [hash: string]: {
            task: string
          }
        }
      }
    }

    apps: {
      [key: string]: {
        task: string
      }
    }

    tasks: {
      [key: string]: {
        staTime: number
        status: string
        startTime: number
        endTime: number
        logDocumetId: string
      }
    }
  }
  config: any
}

type ProjectCommits = Commit[]

interface Commit {
  hash: string
  author: string
  date: number
  message: string
}
