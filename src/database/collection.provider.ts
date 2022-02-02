import { Injectable } from '@nestjs/common';
import { Collection, CollectionOptions, Db } from 'mongodb';

@Injectable()
export class CollectionProvider {
  constructor(private database: Db) {}

  getCollection(name: string): Collection {
    // Prioritize safety over speed
    // Ensures enough nodes have really written the data.
    // Set default write concern to majority, wait for journal to be written and set a write timeout instead of infinite.
    const options: CollectionOptions = {
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 5000,
      },
    };

    return this.database.collection(name, options);
  }
}
