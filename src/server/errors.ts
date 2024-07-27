import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import app from '@/server/app';
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

  if (error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError) {
    app.log.error({
      message: 'Database error',
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        cause: error.cause,
        clientVersion: error.clientVersion,
        stack: error.stack,
      },
    });
  } else {
    app.log.error({
      message: 'Internal server error',
      error,
    });
  }

  return reply.status(500).send({
    message: 'Internal server error',
  } satisfies ConversionComponents['schemas']['InternalServerError']);
}
