import { consola } from 'consola';

import * as Sentry from '@sentry/node';
import { useStorage } from '@bit-ship/local-sdk';


export const setupConsola = async () => {

  const { state } = useStorage()
  const isSentryDisabled = await state.isSentryDisabled.exists()

  if (isSentryDisabled) {
    return
  }


  Sentry.init({
    dsn: 'https://41b66ad2d847d5fbc79561d55988ddee@o4507703272996864.ingest.de.sentry.io/4507793192124496',
    integrations: [
      // nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 0.5, //  Capture 100% of the transactions

    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });

  consola.addReporter({
    // @ts-ignore
    log: (logObj: any) => {
      if (logObj.level === 0) {
        Sentry.captureMessage(logObj.args)
      }
    }
  })


}
