import { FactoryProvider, Module } from '@nestjs/common';
import { MongoConfig } from '../config/mongo.config';
import { Collection, Db, MongoClient } from 'mongodb';
import { ClientProvider } from './client.provider';
import { DatabaseProvider } from './database.provider';
import {
  COLLECTIONS_INSTANCE,
  DATABASE_COLLECTION_NAMES,
} from './database-collections';
import { CollectionProvider } from './collection.provider';
import { ConfigModule } from '../config/config.module';

const ClientFactory: FactoryProvider = {
  provide: MongoClient,
  useFactory: async (clientProvider: ClientProvider): Promise<MongoClient> =>
    clientProvider.createClient(),
  inject: [ClientProvider],
};

const DatabaseFactory: FactoryProvider = {
  provide: Db,
  useFactory: (config: MongoConfig, databaseProvider: DatabaseProvider): Db =>
    databaseProvider.getDatabase(config.databaseName()),
  inject: [MongoConfig, DatabaseProvider],
};

const TournamentsFactory: FactoryProvider = {
  provide: COLLECTIONS_INSTANCE.TOURNAMENTS,
  useFactory: (collectionProvider: CollectionProvider): Collection =>
    collectionProvider.getCollection(DATABASE_COLLECTION_NAMES.TOURNAMENTS),
  inject: [CollectionProvider],
};

const MatchesFactory: FactoryProvider = {
  provide: COLLECTIONS_INSTANCE.MATCHES,
  useFactory: (collectionProvider: CollectionProvider): Collection =>
    collectionProvider.getCollection(DATABASE_COLLECTION_NAMES.MATCHES),
  inject: [CollectionProvider],
};

@Module({
  imports: [ConfigModule],
  providers: [
    ClientProvider,
    DatabaseProvider,
    CollectionProvider,
    ClientFactory,
    DatabaseFactory,
    TournamentsFactory,
    MatchesFactory,
  ],
  exports: [ClientFactory, DatabaseFactory, TournamentsFactory, MatchesFactory],
})
export class DatabaseModule {}
