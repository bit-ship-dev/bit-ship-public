import { initTRPC } from "@trpc/server";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { getProjectInfo } from '../../projects'

export type AppRouter = typeof appRouter;
const t = initTRPC.create();
const isDevMode = true;

export const setupAPI = () => {
  const wss = new WebSocketServer({
    port: 8080,
    verifyClient: (info, cb) => {
      const origin = info.origin;
      if (origin === "https://app.bit-ship.dev" || isDevMode) {
        cb(true);
      } else {
        cb(false, 403, "Forbidden");
      }
    },
  });

  applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext: () => ({}),
  });

  // Timer: send message to all connected clients every 3s
  // wss.clients.forEach((client) => {
  //   if (client.readyState === client.OPEN) {
  //     client.send(JSON.stringify({ type: "heartbeat", ts: Date.now() }));
  //   }
  // });

  wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log("tRPC WebSocket server running on ws://localhost:8080");
};

const appRouter = t.router({
  info: t.procedure.query(() => getProjectInfo()),
  logs: t.procedure.query(({ input }) => getProjectInfo()),
  commits: t.procedure.query(({ input }) => getProjectInfo()),
});

