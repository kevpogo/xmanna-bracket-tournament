import { Injectable } from '@nestjs/common';
import { MongoClient, ReadPreference } from 'mongodb';
import { MongoConfig } from '../config/mongo.config';

@Injectable()
export class ClientProvider {
  constructor(private mongoConfig: MongoConfig) {}

  async createClient(): Promise<MongoClient> {
    return await MongoClient.connect(this.mongoConfig.url(), {
      readPreference: ReadPreference.SECONDARY_PREFERRED,
    });
  }

  async closeClient(client: MongoClient): Promise<void> {
    await client.close();
  }
}
