// IMPORTANT: instrument.ts MUST be the first import — Sentry needs to wrap
// Node's runtime before any other module is loaded.
import './instrument';

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);

  app.use(helmet());

  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:3000').split(','),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api', { exclude: ['health'] });

  // Note: Sentry's NestJS error filter is registered as APP_FILTER inside
  // AppModule (SentryGlobalFilter). No imperative setup needed here — the
  // deprecated `setupNestErrorHandler` path is gone.

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);

  Logger.log(`API listening on http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Health check at  http://localhost:${port}/health`, 'Bootstrap');
}

bootstrap().catch((err) => {
  Logger.error('Failed to bootstrap API', err, 'Bootstrap');
  // Send the bootstrap failure to Sentry before exiting, if configured.
  Sentry.captureException(err);
  process.exit(1);
});
