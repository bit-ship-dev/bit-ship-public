// Names of supported tools https://www.bit-ship.dev/tools
import {ToolsNames} from "../shared";

export interface Image {
  name: string,
  dependencies?: {
    [key in ToolsNames]?: string
  }
}
