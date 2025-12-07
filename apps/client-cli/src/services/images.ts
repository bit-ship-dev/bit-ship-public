import {ofetch} from 'ofetch';
import consola from 'consola';
import {loader} from '../utils/cli';
import {useEnvironment} from './environment';

const {apiURL} = useEnvironment().env

export const useImage = () => ({
  create
})

async function create(dependencies = {} ){
  consola.box('Image configuration');
  let editImage = false;

  if (Object.keys(dependencies).length) {
    consola.info('Dependencies found in your project');
    Object.keys(dependencies).forEach((key) => {
      // @ts-ignore
      consola.log(`${key} -> ${dependencies[key]}`)
    })
    editImage = !(await consola.prompt('Are dependencies correct?', {type: 'confirm'}))
    if (editImage) {


      const pickedTools = await consola.prompt('Remove tools', {
        type: 'multiselect',
        required: false,
        options: Object.keys(dependencies).map((tool) =>
          ({label: tool, value: tool, hint: dependencies[tool].version}))
      });
      // @ts-ignore
      pickedTools.forEach((tool: string) => delete dependencies[tool])
    }
  }

  const tools = await fetchTools()

  if(!Object.keys(dependencies).length || editImage) {
    consola.info('You can find more at https://www.bit-ship.dev/tools');
    const options = Object.keys(tools).map((tool) =>
      ({label: tools[tool].label, value: tool, hint: tools[tool].description})
    ).filter((tool) => !Object.keys(dependencies).includes(tool.value))
    const pickedTools = await consola.prompt('Add any more tooling', {
      type: 'multiselect',
      required: false,
      options: options
    });

    for (const tool of pickedTools) {
      const version = await consola.prompt(`Pick ${tool}version`, {
        type: 'select',
        required: true,
        options: tools[tool].versions
      });
      dependencies[tool] = version
    }
  }


  let status = 'queued';
  const loaderCancel = loader(() => `Please wait while we prepare your image: ${status}`)

  try {
    const {name} = await getImage(dependencies, 0, (_status: string) => status = _status)
    consola.start('Generating initial bit-ship.yml config');
    loaderCancel()
    return { name, dependencies }
  } catch (error) {
    loaderCancel()
    consola.error(error)
  }
}



const getImage = (dependencies: any, retry: number, updateStatus: any) =>
  new Promise<any>((resolve, reject) => {
    ofetch(`${apiURL}/public/v1/image`, {method: 'POST', body: {dependencies}})
      .then((data) => {
        if(data.status === 'finished') {
          consola.success('Image is ready')
          return resolve(data)
        } else if((data.status === 'queued' || data.status === 'running') && retry < 800) {

          updateStatus(data.status === 'running' ? 'building' : 'queued')
          return setTimeout(() => {
            getImage(dependencies, retry++, updateStatus).then(resolve).catch(reject)
          }, 2000)
        }
        reject(data)
      })
      .catch(reject)
  })


async function fetchTools()    {
  return await ofetch(`${apiURL}/public/v1/tools`)
}
