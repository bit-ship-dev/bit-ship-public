import type { ClientConfig } from '@bit-ship/local-sdk'
import type { ParsedName, Categories } from '../services/run'

export const resolveRawName = (rawName: string, config: ClientConfig): ParsedName => {
  const categories: Categories[] = ['jobs', 'apps', 'tasks']
  const category =
    // Prefix Match
    categories.find((category) =>
      rawName.startsWith(`${category}:`) && config[category][rawName.replace(`${category}:`, '')]) ||
    //Item Match
    categories.find((category) => config?.[category]?.[rawName])
  const wildCardCategory = categories.find((cat) => cat === rawName)

  let names: string[] = []
  if (category) {
    names.push(rawName.replace(category + ':', ''))
  } else if (wildCardCategory) {
    names = Object.keys(config[wildCardCategory])
  }

  return { names, category: category || wildCardCategory }
}




export const getContainerName = (category: Categories, name: string) =>
  `bit-${category}-${name}`
