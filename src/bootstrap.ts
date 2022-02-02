import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalConfig } from './config/global.config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.useGlobalPipes(new ValidationPipe());

  configureSwagger(app);

  await app.listen(globalConfig.port());
}

const configureSwagger = (app: INestApplication): void => {
  SwaggerModule.setup(
    '/info',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Bracket Tournament API')
        .setDescription('Simple gestion of bracket tournament')
        .setContact(
          'Kevin Pogorzelski',
          'https://twitter.com/kevpogo',
          'kevin.pogorzelski@gmail.com',
        )
        .setVersion('1.0')
        .build(),
    ),
  );
};
