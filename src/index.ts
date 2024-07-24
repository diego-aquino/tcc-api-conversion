import { environment } from './config/environment';
import server from './server/server';
import { loadServerSwagger } from './server/swagger';

async function startServer() {
  try {
    await loadServerSwagger();

    await server.listen({
      host: '0.0.0.0',
      port: environment.PORT,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

void startServer();
