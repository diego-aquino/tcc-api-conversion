import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import fastify from 'fastify';
import path from 'path';
import type { PathParamsSchemaFromPath, LiteralHttpServiceSchemaPath } from 'zimic/http';
import { z } from 'zod';

import { database } from '@/database/client';
import { ConversionComponents, ConversionOperations, ConversionSchema } from '@/types/generated';
import { generateRandomInteger } from '@/utils/data';

import { environment } from '../config/environment';
import { handleServerError, NotFoundError } from './errors';

const OUTPUT_FILE_SIZE_RATIO = 0.9;
const MIN_CONVERSION_DURATION = 100;
const MAX_CONVERSION_DURATION = 750;

const server = fastify({
  logger: true,
  disableRequestLogging: environment.NODE_ENV !== 'development',
  pluginTimeout: 0,
});

export type ConversionPath = LiteralHttpServiceSchemaPath<ConversionSchema>;

function inferFileType(fileName: string) {
  return path.extname(fileName).replace(/^\./, '');
}

type ConversionWithFiles = Prisma.ConversionGetPayload<{
  include: {
    inputFile: true;
    outputFile: true;
  };
}>;

function formatConversionToResponse(conversion: ConversionWithFiles): ConversionComponents['schemas']['Conversion'] {
  return {
    id: conversion.id,
    state: conversion.state,
    inputFileName: conversion.inputFile.name,
    inputFileType: conversion.inputFile.type,
    inputFileSize: conversion.inputFile.size,
    outputFileName: conversion.outputFile.name,
    outputFileType: conversion.outputFile.type,
    outputFileSize: conversion.outputFile.size,
    createdAt: conversion.createdAt.toISOString(),
    completedAt: conversion.completedAt?.toISOString() ?? null,
  };
}

function generateConversionCompletionDate() {
  const conversionDuration = generateRandomInteger(MIN_CONVERSION_DURATION, MAX_CONVERSION_DURATION + 1);
  return new Date(Date.now() + conversionDuration);
}

const createConversionSchema = z.object({
  inputFileName: z.string(),
  inputFileType: z.string().optional(),
  inputFileSize: z.number(),
  outputFileType: z.string(),
});

server.post('/conversions' satisfies ConversionPath, async (request, reply) => {
  const {
    inputFileName,
    inputFileType = inferFileType(inputFileName),
    inputFileSize,
    outputFileType,
  } = createConversionSchema.parse(
    request.body,
  ) satisfies ConversionOperations['conversions/create']['request']['body'];

  const outputFileName = `${path.basename(inputFileName, path.extname(inputFileName))}.${outputFileType}`;

  const conversion = await database.conversion.create({
    data: {
      id: createId(),
      state: 'PENDING',
      inputFile: {
        create: {
          id: createId(),
          name: inputFileName,
          type: inputFileType,
          size: inputFileSize,
        },
      },
      outputFile: {
        create: {
          id: createId(),
          name: outputFileName,
          type: outputFileType,
          size: Math.floor(inputFileSize * OUTPUT_FILE_SIZE_RATIO),
        },
      },
      completedAt: null,
      toBeCompletedAt: generateConversionCompletionDate(),
    },
    include: {
      inputFile: true,
      outputFile: true,
    },
  });

  const conversionResponse = formatConversionToResponse(conversion);

  await reply
    .status(202)
    .send(conversionResponse satisfies ConversionOperations['conversions/create']['response']['202']['body']);
});

const getConversionSchema = z.object({
  conversionId: z.string(),
});

type GetConversionByIdParams = PathParamsSchemaFromPath<Extract<ConversionPath, '/conversions/:conversionId'>>;

server.get('/conversions/:conversionId' satisfies ConversionPath, async (request, reply) => {
  const { conversionId } = getConversionSchema.parse(request.params) satisfies GetConversionByIdParams;

  const conversion = await database.conversion.findUnique({
    where: { id: conversionId },
    include: {
      inputFile: true,
      outputFile: true,
    },
  });

  if (!conversion) {
    throw new NotFoundError('Conversion not found');
  }

  const shouldMarkAsCompleted = conversion.state === 'PENDING' && conversion.toBeCompletedAt.getTime() <= Date.now();
  if (shouldMarkAsCompleted) {
    const updateData: Prisma.ConversionUpdateInput = {
      state: 'COMPLETED',
      completedAt: conversion.toBeCompletedAt,
    };

    await database.conversion.update({
      where: { id: conversionId },
      data: updateData,
    });

    Object.assign(conversion, updateData);
  }

  const conversionResponse = formatConversionToResponse(conversion);

  await reply
    .status(200)
    .send(conversionResponse satisfies ConversionOperations['conversions/getById']['response']['200']['body']);
});

server.setErrorHandler(handleServerError);

export default server;
