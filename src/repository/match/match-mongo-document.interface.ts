import { MatchStatus } from '../../domain/match-status';
import { ObjectId } from 'mongodb';

export interface MatchMongoDocumentInterface {
  _id: ObjectId;
  tournamentId: string;
  status: MatchStatus;
  level: number;
  index: number;
  players: {
    name: string;
    score?: number;
  }[];
  winner?: string;
}
