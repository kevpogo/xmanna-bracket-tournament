import * as env from 'env-var';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoConfig {
  url(): string {
    return env
      .get('MONGODB_URL')
      .default('mongodb://127.0.0.1:27017')
      .asString();
  }

  databaseName(): string {
    return env
      .get('MONGODB_DATABASE_NAME')
      .default('bracket-tournament')
      .asString();
  }
}
