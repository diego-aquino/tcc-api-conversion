import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import path from 'path';

import { PUBLIC_DIRECTORY, ROOT_DIRECTORY } from '@/config/constants';

import app from './app';

const OPENAPI_SPEC_DIRECTORY = path.join(ROOT_DIRECTORY, 'docs', 'spec');

export async function loadSwagger() {
  await app.register(fastifySwagger, {
    mode: 'static',
    specification: {
      path: path.join(OPENAPI_SPEC_DIRECTORY, 'openapi.yaml'),
      baseDir: OPENAPI_SPEC_DIRECTORY,
    },
  });

  await app.register(fastifySwaggerUI, {
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
