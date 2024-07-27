import app from '@/server/app';
import { loadSwagger } from '@/server/swagger';

const pluginsLoadPromise = loadSwagger();

async function serverlessHandler(request: Request, response: Response) {
  await pluginsLoadPromise;
  await app.ready();

  app.server.emit('request', request, response);
}

export default serverlessHandler;
