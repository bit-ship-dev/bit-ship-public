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


    try {
      consola.start('Image build requested');
      const {imageName} = await getImage({
        version: report.version,
        dependencies
      }, 0)
      consola.start('Generating initial bit-ship.yml config');
      await setConfig({
        version: '1.0',
        images: {
          default: imageName
        },
        dependencies,
        tasks
      });
      consola.success('Analysis completed');
    } catch (error) {
      consola.error('Failed to prepare image')
      console.log(error)
    }
  },
});

const getImage = (report: any, retry: number) =>
  new Promise<any>((resolve, reject) => {
    ofetch(`${apiURL}/public/v1/image`, {method: 'POST', body: {report}})
      .then((data) => {
        if(data.state === 'prepared') {
          consola.success('Image is ready')
          return resolve(data)
        } else if((data.state === 'queued' || data.state === 'building') && retry < 200) {
          process.stdout.write(`\rimage status: ${data.state}`)
          return setTimeout(() => {
            getImage(report, retry++).then(resolve).catch(reject)
          }, 2000)
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
    detouched: true,
    script: 'node /analyser-cli/index.mjs',
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
  consola.info('You can find more at https://www.bit-ship.dev/tools');

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
