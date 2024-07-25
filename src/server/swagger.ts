import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import path from 'path';

import { ROOT_DIRECTORY } from '@/config/constants';

import server from './server';

const OPENAPI_SPEC_DIRECTORY = path.join(ROOT_DIRECTORY, 'docs', 'spec');

export async function loadServerSwagger() {
  await server.register(fastifyStatic, {
    root: OPENAPI_SPEC_DIRECTORY,
    prefix: '/spec',
  });

  await server.register(fastifySwagger, {
    mode: 'static',
    specification: {
      path: path.join(OPENAPI_SPEC_DIRECTORY, 'openapi.yaml'),
      baseDir: OPENAPI_SPEC_DIRECTORY,
    },
  });

  await server.register(fastifySwaggerUI, {
    routePrefix: '/',
    staticCSP: true,
    uiConfig: {
      docExpansion: 'list',
      displayRequestDuration: true,
      deepLinking: true,
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
