import { initTRPC } from '@trpc/server'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { WebSocketServer } from 'ws'
import { useProjects } from '../../projects'
import EventEmitter, { on } from 'events'

export type AppRouter = typeof appRouter
const t = initTRPC.create()
const isDevMode = true

const projects = useProjects()

export const setupAPI = () => {
  const wss = new WebSocketServer({
    port: 8080,
    verifyClient: (info, cb) => {
      const origin = info.origin
      if (origin === 'https://app.bit-ship.dev' || isDevMode) {
        cb(true)
      } else {
        cb(false, 403, 'Forbidden')
      }
    }
  })

  applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext: () => ({})
  })

  // Timer: send message to all connected clients every 3s
  // wss.clients.forEach((client) => {
  //   if (client.readyState === client.OPEN) {
  //     client.send(JSON.stringify({ type: "heartbeat", ts: Date.now() }));
  //   }
  // });

  wss.on('connection', (ws) => {
    console.log('New client connected')
    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })

  console.log('tRPC WebSocket server running on ws://localhost:8080')
}

const ee = new EventEmitter()

const a = []

setInterval(() => {
  a.push('====>emiting' + Date.now())
  console.log('====>emiting')
  ee.emit('add', a)
}, 2000)

const appRouter = t.router({
  info: t.procedure.query(() => {
    const _projects = projects.getProjects()
    return {
      version: '1.0.0',
      projects: _projects
    }
  }),
  projectDetail: t.procedure.query(async (ctx) => {
    const input = await ctx.getRawInput()
    return projects.getProjectDetail(input.projectId)
  }),
  projectCommits: t.procedure.query(async (ctx) => {
    const input = await ctx.getRawInput()
    console.log('=-====>', input)
    return projects.getCommits(input.projectId)
  }),
  projectConfig: t.procedure.query(() => {
    console.log('projectCOnfig')
  }),
  // logs: t.procedure.query(({ input }) => {
  //   console.log('==========>')
  //   // TODO log id
  // })

  logs: t.procedure.subscription(async function* (opts) {
    // listen for new events
    for await (const [data] of on(ee, 'add', {
      // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
      signal: opts.signal
    })) {
      const post = data as Post
      yield post
    }
  })
})
