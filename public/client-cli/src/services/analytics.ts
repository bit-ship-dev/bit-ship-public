import {ofetch} from 'ofetch';
import consola from 'consola';

const url = 'http://localhost:3000/api'


export const setupAnalytics = async () => {

}

export const useAnalytics = () => ({
  capture
})

async function capture(eventName: EventName, data: any) {
  try {
    await ofetch(`${url}/analytics/cli/${eventName}`, {
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    consola.log('Failed to send analytics event', err)
  }
}


type EventName = 'install' | 'usage-ping'
