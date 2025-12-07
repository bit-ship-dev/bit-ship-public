import { ofetch } from 'ofetch'
import consola from 'consola'
import { useEnvironment } from './environment'
import { useStorage } from '@bit-ship/local-sdk'
import { v4 as uuidv4 } from 'uuid'

const { apiURL } = useEnvironment().env

export const setupAnalytics = async () => {
  try {
    const storage = useStorage()
    let date: string = await storage.state.lastUsageDate.get()
    let uuid = await storage.state.uuid.get()
    if (!uuid) {
      uuid = uuidv4()

      storage.uuid.set(uuid)
      capture('install', { uuid })
      date = new Date().toISOString()
      await storage.lastUsageDate.set(date)
    }
    // @ts-ignore
    if (!isToday(date)) {
      capture('usage-ping', { uuid })
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
    // eslint-disable-next-line
  } catch (_err) {
    // consola.log('')
  }
}

const isToday = (isoString: string) => {
  const date = new Date(isoString)
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

type EventName = 'install' | 'usage-ping'
