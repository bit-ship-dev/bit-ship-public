//@ts-ignore
import { existsSync } from 'fs';
import {addDependency} from '../../services/report';


export const analyseDependencies = (packageJson: any, root = '/app/'): void  => {
  const version = packageJson?.engines?.node || 'latest'
  addDependency('node', version)
  validateBundler(packageJson, root)
}


function validateBundler(packageJson: any, root: string) {
  if (packageJson.packageManager?.includes('pnpm') || existsSync(root+'pnpm-lock.yaml')){
    addDependency('pnpm', 'latest')
  } else if (packageJson.packageManager?.includes('yarn') || existsSync(root+'yarn.lock')){
    addDependency('yarn', 'latest')
  }
}



