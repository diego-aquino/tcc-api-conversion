import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import path from 'path';

import { PUBLIC_DIRECTORY, ROOT_DIRECTORY } from '@/config/constants';

import app from './app';

const OPENAPI_SPEC_DIRECTORY = path.join(ROOT_DIRECTORY, 'docs', 'spec');

export async function loadPlugins() {
  await app.register(cors, { origin: '*' });

  await app.register(swagger, {
    mode: 'static',
    specification: {
      path: path.join(OPENAPI_SPEC_DIRECTORY, 'openapi.yaml'),
      baseDir: OPENAPI_SPEC_DIRECTORY,
    },
  });

  await app.register(swaggerUI, {
    routePrefix: '/',
    baseDir: path.join(PUBLIC_DIRECTORY, 'static'),
    uiConfig: {
      docExpansion: 'list',
      displayRequestDuration: true,
    },
    theme: {
      title: 'API de Conversão',
      css: [
        {
          filename: 'custom.css',
          content: '.swagger-ui .topbar { display: none; }',
        },
      ],
    },
  });
}
