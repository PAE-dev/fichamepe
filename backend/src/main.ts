import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = Number(process.env.APP_PORT ?? process.env.PORT ?? 3000);
  try {
    await app.listen(port);
  } catch (err: unknown) {
    const code =
      err && typeof err === 'object' && 'code' in err ? String((err as { code: unknown }).code) : '';
    if (code === 'EADDRINUSE') {
      // eslint-disable-next-line no-console
      console.error(
        `\n[fichamepe] El puerto ${port} ya está en uso. Cierra el otro proceso (p. ej. otro \`nest start\`) o cambia APP_PORT en .env.\n` +
          `  Linux: fuser -k ${port}/tcp  o  lsof -i :${port}\n`,
      );
      process.exit(1);
    }
    throw err;
  }
}
bootstrap();
