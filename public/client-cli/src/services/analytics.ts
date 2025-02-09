import {ofetch} from 'ofetch';
import consola from 'consola';
import {useEnvironment} from './environment';
import {useStorage} from './storage';
import {v4 as uuidv4} from 'uuid';

const {apiURL} = useEnvironment()


export const setupAnalytics = async () => {
  try {
    const storage = useStorage()
    let date: string = await storage.getItem('lastUsageDate')
    let uuid = await storage.getItem('uuid')
    if (!date || !uuid) {
      uuid = uuidv4();
      storage.setItem('uuid', uuid);
      capture('install', {uuid});
      date = new Date().toISOString()
      await storage.setItem('lastUsageDate', date)
    }
    // @ts-ignore
    else if (!isToday(date)) {
      capture('usage-ping', {uuid: uuid})
    }
  } catch (err) {
    consola.error('Failed to init analytics', err)
  }
}

export const useAnalytics = () => ({
  capture
})

async function capture(eventName: EventName, data: any) {
  try {
    await ofetch(`${apiURL}/analytics/cli/${eventName}`, {
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    consola.log('Failed to send analytics event', err)
  }
}

const isToday = (isoString: string) => {
  const date = new Date(isoString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}


type EventName = 'install' | 'usage-ping'
