

export interface Tools {
  [key: string]: Tool
}

export interface Tool {
  label: string
  description?: string
  flags?: {

  }
}


export type DefaultTasks = 'start' | 'dev' | 'build' | 'qa'


export type ToolNames =
  // ===============<General
  // General Browsers
  'chromium' |
  // ===============<JS
  // JS runtimes
  'node' | 'bun' | 'deno' |
  // JS package managers
  'npm' | 'yarn' | 'pnpm' |
  // JS QA tools
  'jest' | 'vitest' | 'cypress' | 'playwright' | 'eslint' | 'dependency-cruiser'
