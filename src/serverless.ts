import app from '@/server/app';
import { loadPlugins } from '@/server/plugins';

const pluginsLoadPromise = loadPlugins();

async function serverlessHandler(request: Request, response: Response) {
  await pluginsLoadPromise;
  await app.ready();

  app.server.emit('request', request, response);
}

export default serverlessHandler;
