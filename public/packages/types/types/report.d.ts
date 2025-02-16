import { ScriptCategory } from './tools'
import {ToolsNames} from "./shared";

// Report is output of analysis of the project.
// It contains information about dependencies and scripts
// Don't confuse report with config as report is for internal usage
// and configuration derived from report with some additional information from user


export interface Report {
  '1.0': Report_1_0
}


interface Report_1_0 {
  // Report version
  version: '1.0'

  name?: string

  // Dependencies to install
  dependencies: {
    [key in ToolsNames]?: {
      version: string
    }
  }

  // Scripts analysis
  tasks: {
    [key in ScriptCategory]: {
      script: string,
      location: string,
      value: number
    }[]
  }
}


