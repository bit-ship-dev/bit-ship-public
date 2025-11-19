import {consola} from 'consola';
import * as process from 'node:process';
import {analyseJs} from './modules/js';

import {getReport} from './services/report';
import {loadRepo} from './modules/repository/repository';
import {writeFile} from 'fs/promises';
import {AnalyserReport} from './types/report';

const reportStorePath: string = process.env.STORE_REPORT_LOCALLY || './tmp_report.json'
const repoUrl: string= process.env.REPO_URL || ''
const targetPath: string = './'


const analyseRepo = async (): Promise<AnalyserReport> => {
  try {
    if (repoUrl) {
      await loadRepo(repoUrl, targetPath)
    }
    await Promise.all([
      analyseJs(targetPath)
    ])
    const report = await getReport(reportStorePath)

    await writeFile(reportStorePath, JSON.stringify(report, null, 2))
    consola.success(`Report generated and stored locally in ${reportStorePath}`)

    return report
  } catch (error) {
    consola.error(error)
  }
}

analyseRepo()

