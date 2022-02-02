import { Injectable } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class DatabaseProvider {
  constructor(private client: MongoClient) {}

  getDatabase(name: string): Db {
    return this.client.db(name);
  }
}
