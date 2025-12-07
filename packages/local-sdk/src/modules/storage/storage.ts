import { createStorage, type Storage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
// @ts-ignore
import os from 'os'
import { schema } from './state'

const latestSchema = schema[schema.length - 1]
const homeDir = os.homedir()
let storage!: Storage
let stateSDK = {}
const watchCallbacks: WatchCallbacks = {}
const defaultPath = `${homeDir}/.bit-ship/data`

export const setupStorage = async (path: string) => {
  const storageLocation = path || defaultPath

  storage = await createStorage({
    driver: fsDriver({ base: storageLocation })
  })
  storage.watch((event, key) => {
    if (!watchCallbacks[key]?.length) {
      return
    }
    watchCallbacks[key].forEach((callback) => callback(event))
  })
  stateSDK = Object.entries(latestSchema.state).reduce((acc: any, [key, val]) => {
    watchCallbacks[key] = []
    const stateAccess = getStateFunction(key, val)
    if (val.collection) {
      const getAllKeys = () => getKeysOfCollection(key)
      acc[key] = {
        getAll: async () => {
          const list = await getAllKeys()
          const result: any = {}
          await Promise.all(
            list.map(async (itemKey) => {
              result[itemKey] = await stateAccess(itemKey).get()
            })
          )
          return result
        },
        getAllKeys,
        findOne: stateAccess
      }
    } else {
      acc[key] = stateAccess('')
    }

    return acc
  }, {})
}
export const useStorage = () => {
  if (!Object.keys(stateSDK)) {
    return console.error('Storage is not inicialized')
  }
  return {
    clearAll: () => storage.clear(),
    state: stateSDK
  }
}

async function getKeysOfCollection(key: string) {
  const keys = await storage.getKeys(getCollectionKey(key, ''))
  return keys.map((item: string) => item.replace(`${key}:`, ''))
}

function getStateFunction(itemKey: string, itemValue) {
  return (id: string) => {
    const key = id ? getCollectionKey(itemKey, id) : itemKey
    return {
      get: () => storage.getItem(key),
      set: async (val: any) => {
        const { error } = itemValue.schema.validate(val)
        if (error) {
          console.error('state set error', error)
        }
        return await storage.setItem(key, val)
      },
      watch: (callback: () => string) => {
        watchCallbacks[key].push(callback)
        const index = watchCallbacks[key].length - 1
        return () => {
          watchCallbacks[key].splice(index, 1)
        }
      },
      exists: () => storage.hasItem(key),
      remove: () => storage.removeItem(key)
    }
  }
}

const getCollectionKey = (collection: string, item: string) => {
  return `${collection}:${item}`
}

interface WatchCallbacks {
  [key: string]: Array<(event: any) => any>
}
