import consola from 'consola'
import { useConfig } from '@bit-ship/local-sdk'
import { exec } from 'child_process'
import { useImage } from '../../services/images'

export const setupImageModule = (program) => {
  const { create } = useImage()
  const { getConfig, setConfig } = useConfig()

  const image = program.command('image').description('Creat, Edit or rebuild image')

  image
    .command('create')
    .description('Create a new image')
    .action(async () => {
      console.log('Creating image')
      const name = await consola.prompt('Name of the image', { type: 'text', required: true })
      const image = await create({})
      setConfig({ images: { [name]: image } })
      process.exit(0)
    })

  image
    .command('build')
    .argument('<name>')
    .description('Build image')
    .action(async (imageName: string) => {
      const config = getConfig()
      const img = config.images[imageName]
      if (!img) {
        return consola.error(`No image with name ${imageName} found`)
      }
      consola.start('Building local image')
      // eslint-disable-next-line  sonarjs/os-command
      exec(`podman build -t ${img.name} ${img.build}`, (error, stdout, stderr) => {
        if (error) {
          console.error(error)
          return
        }
        if (stderr) {
          console.error(stderr)
          return
        }
        console.log(stdout)
      })
      process.exit(0)
    })
}
