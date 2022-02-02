import { random } from 'lodash';
import { Collection, Db, MongoClient } from 'mongodb';
import { MongoConfig } from '../config/mongo.config';
import { ClientProvider } from './client.provider';
import { DatabaseProvider } from './database.provider';

const databaseName = 'bracket-tournament';
const collectionNamePrefix = 'test';

let mongoClient: MongoClient | undefined;
let database: Db | undefined;

const createMongoClient = async (): Promise<MongoClient> => {
  const mongoConfig = new MongoConfig();
  return new ClientProvider(mongoConfig).createClient();
};

export const getMongoClient = async (): Promise<MongoClient> => {
  if (mongoClient) {
    return mongoClient;
  }

  const client = await createMongoClient();
  mongoClient = client;
  return client;
};

export const closeMongoClient = async (): Promise<void> => {
  if (mongoClient) {
    await mongoClient.close();
  }
};

const forceCreation = async (collection: Collection): Promise<void> => {
  await collection.insertOne({});
  await collection.deleteMany({});
};

export const getDatabase = async (): Promise<Db> => {
  if (database) {
    return database;
  }

  const client = await getMongoClient();
  database = new DatabaseProvider(client).getDatabase(databaseName);
  return database;
};

export const createCollection = async (
  collectionName?: string,
): Promise<Collection> => {
  const db = await getDatabase();

  collectionName = `${
    collectionName ?? collectionNamePrefix
  }_${new Date().getTime()}_${random(100, 999)}`;

  const collection = db.collection(collectionName, {
    writeConcern: {
      j: false, // Journal is disabled in circleci
      w: 1,
      wtimeout: 5000,
    },
  });

  // Avoid Mongo error (`MongoError: ns not found`) given the collection does not exist
  await forceCreation(collection);

  return collection;
};

export const deleteCollection = async (
  collection: Collection,
): Promise<void> => {
  if (collection) {
    await collection.drop();
  }
};
