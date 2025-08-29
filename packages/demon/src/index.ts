import { createServer } from 'node:http';
import { createProxyServer } from 'httpxy';
import {homepage}  from './homepage';
import {readProjects, getApps, getLocations} from './projects'

const port = 80;
let apps
let locations
let proxy

const main = async () => {
  const projects = await readProjects()
  proxy = createProxyServer({});
  apps = getApps(projects)
  locations = getLocations(projects)
  console.log(locations)
  const server = createServer(handleRequest);
  server.listen(port, () => console.log(`Demon is listening on http://localhost:${port}`));
}
main()

async function handleRequest(req, res) {
  try {
    const kHeaders = getSymbolProperty(req, 'kHeaders')
    const host = kHeaders.host
    console.log('======>finding match', host, Object.keys(locations))
    const url = Object.keys(locations).find((url) => host === url)

    if (url) {
      const params = locations[url]
      const proxyUrl = params.containerName+':'+params.port
      console.log('proxying', proxyUrl)
      await proxy.web(req, res, {target: proxyUrl});
      return
    }
    res.end(homepage(apps));
    res.statusCode = 200;
  } catch (err) {
    console.error(err)
  }
}

// =======================> Helpers
function getSymbolProperty(obj, symbolName) {
  const symbols = Object.getOwnPropertySymbols(obj);
  const targetSymbol = symbols.find(sym => sym.description === symbolName);
  if (targetSymbol) {
    return obj[targetSymbol];
  }
  return undefined;
}

