import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import server from '@/server/server';
import { ConversionComponents } from '@/types/generated';

export class NotFoundError extends Error {}

export function handleServerError(error: FastifyError, _request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.issues,
    } satisfies ConversionComponents['schemas']['ValidationError']);
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message,
    } satisfies ConversionComponents['schemas']['NotFoundError']);
  }

  server.log.error({
    message: 'Internal server error',
    error,
  });

  return reply.status(500).send({
    message: 'Internal server error',
  } satisfies ConversionComponents['schemas']['InternalServerError']);
}
