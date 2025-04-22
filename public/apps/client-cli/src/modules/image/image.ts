import {defineCommand} from 'citty';
import {useImage} from '../../services/images';
import consola from 'consola';
import {useConfig} from '../../services/config';

const {create} = useImage()

const {setConfig} =  useConfig()

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
  },
});




