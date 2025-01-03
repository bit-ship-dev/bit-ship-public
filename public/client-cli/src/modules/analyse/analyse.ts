import consola from 'consola';
import {defineCommand} from 'citty';
import {ofetch} from 'ofetch';
import type {Report} from '@bit-ship/types/types/index.d';
import {readFile, unlink} from 'fs/promises'
import {useConfig} from '../../services/config';
import {useContainer} from '../../services/container';
import {ClientConfig} from '../../services/config.d'
import {useEnvironment} from '../../services/environment';


const {setConfig} = useConfig();

const {apiURL} = useEnvironment()

type AnalyserReport  = Report['1.0']


export default defineCommand({
  meta: {
    name: 'analyse',
    description: 'Analyse your project',
  },
  args: {
    path: {
      type: 'string',
      description: 'Path to the project',
      default: './',
      required: false,
    }
  },
  async run({ args }) {
    const report: Report['1.0'] = await getReport(args.path)
    const tools = await fetchTools()
    const {dependencies, tasks} = await manualValidation(report, tools)

    consola.start('We are preparing image for you');
    try {
      const {imageName} = await getImage(dependencies, report, 0)
      await setConfig({
        version: '1.0',
        images: {
          default: imageName
        },
        dependencies,
        tasks
      });
      consola.success('Configuration saved');
    } catch (error) {
      consola.error('Failed to prepare image')
      console.log(error)
    }
  },
});

const getImage =
  (dependencies: ClientConfig['dependencies'], report: Report['1.0'], retry: number) =>
    new Promise<any>((resolve, reject) => {
      consola.log('Preparing image');
      // @ts-ignore
      const dependencies = Object.keys(report.dependencies).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = report.dependencies[key].version
        return acc
      }, {})

      const body = {
        report: {
          version: report.version,
          dependencies
        }
      }
      ofetch(`${apiURL}/public/v1/image`, {method: 'POST', body})
        .then((data) => {
          if(data.status === 'queued' || data.status === 'building') {
            resolve(data)
            return setTimeout(async() => {
              if (retry > 200) {
                reject('Failed to prepare image')
              }
              try {
                resolve(await getImage(dependencies, report, retry++))
              } catch (error) {
                consola.error(error)
                reject(error)
              }
            }, 1000)
          }
          else if(data.status === 'prepared') {
            return resolve(data)
          }
          reject(data)
        })
        .catch(reject)
    }
    )


async function getReport(path: string): Promise<Report['1.0']> {
  const reportFile = 'tmp_report.json';
  consola.start(`Analyse your project ${path}`);
  const {runContainer} = useContainer();
  await runContainer({
    containerName : 'analyser-cli-'+Date.now(),
    image: 'bitship/analyser-cli',
    platform: 'linux/amd64',
    detouched: false,
    script: 'node /analyser-cli/index.js',
    volumes: [
      `${path}:/app`
    ],
    env:{
      STORE_REPORT_LOCALLY: reportFile,
    }
  });

  const report: Report['1.0'] = JSON.parse(await readFile(reportFile, 'utf8'))
  await unlink(reportFile);
  consola.success('Analysis completed');
  return report;
}

async function manualValidation(report: AnalyserReport, tools: any): Promise<ManualOutput>  {
  report.tasks.build.sort(highToLow);
  report.tasks.start.sort(highToLow);
  report.tasks.dev.sort(highToLow);
  report.tasks.qa.sort(highToLow);

  consola.box('Scripts Configuration');

  const build = await consola.prompt('What is your build script?', {
    placeholder: 'Your build script',
    initial: report.tasks.build[0].script,
  });

  const dev = await consola.prompt('What is your dev script?', {
    placeholder: 'Your dev script',
    initial: report.tasks.dev[0].script,
  });

  const start = await consola.prompt('What is your start script?', {
    placeholder: 'Your start script',
    initial: report.tasks.start?.[0]?.script || '',
  });

  consola.box('Dependencies configuration');


  consola.info('Dependencies found in your project');
  Object.keys(report.dependencies).forEach((key) => {
    // @ts-ignore
    consola.log(`${key} -> ${report.dependencies[key].version}`)
  })

  const options = Object.keys(tools).map((tool) =>
    ({label: tools[tool].label, value: tool, hint: tools[tool].description})
  ).filter((tool) => !Object.keys(report.dependencies).includes(tool.value))

  const pickedTools = await consola.prompt('Add any more tooling', {
    type: 'multiselect',
    required: false,
    options: options
  });

  // @ts-ignore
  const pickedDeps = pickedTools.reduce((acc, key: string) => {
    // @ts-ignore
    acc[key] = tools[key].versions.latest
    return acc
  }, {})


  const foundDependencies = Object.keys(report.dependencies).reduce((acc, key) => {
    // @ts-ignore
    acc[key] = report.dependencies[key].version
    return acc
  }, {})

  return {
    tasks: {
      build: { script: build },
      dev: { script: dev },
      start: { script: start }
    },
    // @ts-ignore
    dependencies: {...pickedDeps, ...foundDependencies},
  }
}


async function fetchTools()    {
  const tools = await ofetch(`${apiURL}/public/v1/tools`)
  return tools
}


const highToLow = (a: any, b: any) =>  b.value - a.value;


type ManualOutput =  {
  tasks: ClientConfig['tasks']
  dependencies: ClientConfig['dependencies']
}
