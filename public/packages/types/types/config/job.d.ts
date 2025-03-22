export interface Job {
  on: {
    commit?: {
      on:  'pre-commit' | 'post-commit'
    },
  },
  tasks: Array<string | string[]>
}
