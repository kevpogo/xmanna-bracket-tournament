import { Module } from '@nestjs/common';
import { GlobalConfig } from './global.config';
import { MongoConfig } from './mongo.config';
import { RulesConfig } from './rules.config';

@Module({
  providers: [GlobalConfig, MongoConfig, RulesConfig],
  exports: [GlobalConfig, MongoConfig, RulesConfig],
})
export class ConfigModule {}
