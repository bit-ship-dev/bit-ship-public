import { createServer } from 'node:http'
import { createProxyServer } from 'httpxy'
import { homepage } from './homepage'

const port = 80
let apps

// TODO fix
const locations = {}

const proxy = createProxyServer({ ws: true })
export const setupProxy = async () => {
  const server = createServer(handleRequest)
  server.on('upgrade', async function (req, socket, head) {
    console.log('upgrading connection to WS', req.url)
    proxy.ws(req, socket, { target: 'ws://localhost:8080' }, head)
  })
  server.listen(port, () => console.log(`Demon is listening on http://localhost:${port}`))
}

async function handleRequest(req, res) {
  try {
    const kHeaders = getSymbolProperty(req, 'kHeaders')
    const host = kHeaders.host
    console.log(host)
    console.log('======>finding match', host, Object.keys(locations))
    const url = Object.keys(locations).find((url) => host === url)
    if (url) {
      const params = locations[url]
      const proxyUrl = params.containerName + ':' + params.port
      console.log('proxying', proxyUrl)
      await proxy.web(req, res, { target: proxyUrl })
      return
    }
    res.end(homepage(apps))
    res.statusCode = 200
  } catch (err) {
    console.error(err)
  }
}

// =======================> Helpers
function getSymbolProperty(obj, symbolName) {
  const symbols = Object.getOwnPropertySymbols(obj)
  const targetSymbol = symbols.find((sym) => sym.description === symbolName)
  if (targetSymbol) {
    return obj[targetSymbol]
  }
  return undefined
}
