export interface Job {
  // Automatic job trigger
  on: {
    commit?: {
      on:  'pre-commit' | 'post-commit'
    },
  },
  // name of the task to be run
  tasks: Array<string | string[]>
}
