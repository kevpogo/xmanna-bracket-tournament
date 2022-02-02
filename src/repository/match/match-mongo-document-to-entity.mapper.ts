import { MatchMongoDocumentInterface } from './match-mongo-document.interface';
import { MatchWithId } from '../../domain/match.entity';
import { Player } from '../../domain/player.entity';
import { MatchId } from '../../domain/match-id';

export class MatchMongoDocumentToEntityMapper {
  static fromMongoDocument(document: MatchMongoDocumentInterface): MatchWithId {
    return new MatchWithId({
      matchId: MatchId.fromMongoObjectId(document._id),
      status: document.status,
      level: document.level,
      index: document.index,
      players: document.players.map(
        ({ name, score }) => new Player({ name, score }),
      ),
      winner: document.winner,
    });
  }
}
