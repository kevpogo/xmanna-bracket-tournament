import { TournamentWithMatchesMongoDocumentInterface } from './tournament-with-matches-mongo-document.interface';
import { TournamentWithIdWithMatches } from '../../domain/tournament-with-matches.entity';
import { MatchMongoDocumentToEntityMapper } from '../match/match-mongo-document-to-entity.mapper';
import { TournamentWithId } from '../../domain/tournament.entity';
import { TournamentId } from '../../domain/tournament-id';

export class TournamentWithMatchesMongoDocumentToEntityMapper {
  static fromMongoDocument(
    document: TournamentWithMatchesMongoDocumentInterface,
  ): TournamentWithIdWithMatches {
    return new TournamentWithIdWithMatches({
      tournament: new TournamentWithId({
        tournamentId: TournamentId.fromMongoObjectId(document._id),
        size: document.size,
        status: document.status,
        players: document.players,
      }),
      matches: document.matches.map(
        MatchMongoDocumentToEntityMapper.fromMongoDocument,
      ),
    });
  }
}
