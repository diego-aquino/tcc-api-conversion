import fastify from 'fastify';

import { environment } from '../config/environment';
import { handleServerError } from './errors';

const server = fastify({
  logger: true,
  disableRequestLogging: environment.NODE_ENV !== 'development',
  pluginTimeout: 0,
});

server.setErrorHandler(handleServerError);

export default server;
