import { TournamentStatus } from '../../domain/tournament-status';
import { ObjectId } from 'mongodb';

export interface TournamentMongoDocumentInterface {
  _id: ObjectId;
  size: number;
  status: TournamentStatus;
  players: string[];
}
