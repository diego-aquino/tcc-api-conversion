import app from '@/server/app';
import { loadServerSwagger } from '@/server/swagger';

const pluginsLoadPromise = loadServerSwagger();

async function serverlessHandler(request: Request, response: Response) {
  await pluginsLoadPromise;
  await app.ready();

  app.server.emit('request', request, response);
}

export default serverlessHandler;
