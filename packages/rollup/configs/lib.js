import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { readFileSync } from 'fs'

const dockerFile = () => ({
  name: 'docker-file',
  load(id) {
    if (id.endsWith('Dockerfile')) {
      const content = readFileSync(id).toString('utf-8')
      return `export default \`${content.replace(/`/g, '\\`')}\``
    }
  }
})

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true
  },
  plugins: [dockerFile(), commonjs(), typescript({})]
}
