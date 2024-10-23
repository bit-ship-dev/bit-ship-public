import {ofetch} from 'ofetch';

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
  } catch (_err) {
    // TODO silent log
  }
}


type EventName = 'install' | 'usage-ping'
