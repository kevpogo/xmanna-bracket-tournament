import { ValueObject } from '../shared/value-object';
import { ObjectId } from 'mongodb';

export class MatchId extends ValueObject<string, 'MatchId'> {
  static fromMongoObjectId(objectId: ObjectId): MatchId {
    return new MatchId(objectId.toString());
  }
}
