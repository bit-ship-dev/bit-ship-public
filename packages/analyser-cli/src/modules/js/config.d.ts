import type {ScriptCategory} from '@repo/ts/types/analyser';

export interface Dependencies {
  [key: ScriptCategory]: DependencyCategory
}
export interface DependencyCategory {
  [key: string]: {
    commandPattern: string;
    value: number;
    flags?: {
      isStaticAnalysis?: boolean;
      isTest?: boolean;
    }
  };
}

interface CommandNames  {
  [category: ScriptCategory]: {
    [keys: 'actions' | 'modes']: {
      value: number
    }
  }
}
