import type {ClientConfig} from '../../../services/config';
import {RunOptions} from '../../../services/container';

export interface ParsedName {
  category: Categories | undefined
  names: string[]
}

export type Categories = 'jobs' | 'apps' | 'tasks'
export interface Handlers {
  apps: Handler
  jobs: Handler
  tasks: Handler
}

export type Handler = (name: string, config: ClientConfig, runOptions?: RunOptions) => Promise<void>
