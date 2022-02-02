import { TournamentMongoDocumentInterface } from './tournament-mongo-document.interface';
import { TournamentWithId } from '../../domain/tournament.entity';
import { TournamentId } from '../../domain/tournament-id';

export class TournamentMongoDocumentToEntityMapper {
  static fromMongoDocument(
    document: TournamentMongoDocumentInterface,
  ): TournamentWithId {
    return new TournamentWithId({
      tournamentId: TournamentId.fromMongoObjectId(document._id),
      size: document.size,
      status: document.status,
      players: document.players,
    });
  }
}
