import server from '@/server/server';
import { loadServerSwagger } from '@/server/swagger';

const pluginsLoadPromise = loadServerSwagger();

async function serverlessHandler(request: Request, response: Response) {
  await pluginsLoadPromise;
  await server.ready();

  server.server.emit('request', request, response);
}

export default serverlessHandler;
