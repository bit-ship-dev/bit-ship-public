import {defineCommand} from 'citty';
import {useImage} from '../../services/images';
import consola from 'consola';
import {useConfig} from '../../services/config'
import {exec} from 'child_process'

const {create} = useImage()

const {setConfig, getConfig} =  useConfig()

export default defineCommand({
  meta: {
    name: 'image',
    description: 'Creat, Edit or rebuild image',
  },
  subCommands: {
    create: {
      meta: {
        name: 'create',
        description: 'Create a new image',
      },
      args: {},
      async run() {
        console.log('Creating image')
        const name = await consola.prompt('Name of the image', {type: 'text', required: true})
        const image = await create({})
        setConfig({images: {[name]: image}})
      }
    },

    build: {
      meta: {
        name: 'create',
        description: 'Create a new image',
      },
      args: {
        imageName: {
          description: 'name of image',
          type: 'positional',
          required: true,
        },
      },
      async run({args}) {
        const config = getConfig()
        const img = config.images[args.imageName]
        if(!img) {
          return consola.error(`No image with name ${args.imageName} found`)
        }
        consola.start('Building local image')
        // eslint-disable-next-line sonarjs/no-os-command-from-path
        exec(`docker build -t ${img.name} ${img.build}`, (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            return;
          }
          if (stderr) {
            console.error(stderr);
            return;
          }
          console.log(stdout);
        });
        
      }
    },
  },
});




