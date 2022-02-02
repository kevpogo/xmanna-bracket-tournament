import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule, ApiModule],
})
export class AppModule {}
