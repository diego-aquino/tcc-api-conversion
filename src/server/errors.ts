import { AxiosError } from 'axios';
import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import server from '@/server/server';
import { ConversionComponents } from '@/types/generated';

export function handleServerError(error: FastifyError, _request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.issues,
    } satisfies ConversionComponents['schemas']['ValidationError']);
  }

  if (error instanceof AxiosError) {
    const formattedError = {
      ...error.toJSON(),
      data: error.response?.data as unknown,
    };

    server.log.error({
      message: 'Request error',
      error: formattedError,
    });
  } else {
    server.log.error({
      message: 'Internal server error',
      error,
    });
  }

  return reply.status(500).send({
    message: 'Internal server error',
  } satisfies ConversionComponents['schemas']['InternalServerError']);
}
