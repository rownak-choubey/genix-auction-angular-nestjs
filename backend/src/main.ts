// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, errorHandler } from './utils/error-handeling/log-error.handeler.middleware';
import express from 'express';
import * as path from 'path';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from './utils/error-handeling/http-exception.filter';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Serve static files
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Logger middleware
  app.use(logger);

  // Error handling filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Handle root URL
  server.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

  // Handle 404 errors
  server.use((req: Request, res: Response) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));
  });

  await app.listen(3000);
}
bootstrap();
