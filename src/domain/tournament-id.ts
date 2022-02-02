import { ValueObject } from '../shared/value-object';
import { ObjectId } from 'mongodb';

export class TournamentId extends ValueObject<string, 'TournamentId'> {
  static fromMongoObjectId(objectId: ObjectId): TournamentId {
    return new TournamentId(objectId.toString());
  }
}
