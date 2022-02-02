import { Inject, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { COLLECTIONS_INSTANCE } from '../../database/database-collections';
import { Match, MatchWithId } from '../../domain/match.entity';
import { MatchStatus } from '../../domain/match-status';
import { MatchMongoDocumentToEntityMapper } from './match-mongo-document-to-entity.mapper';
import { MatchMongoDocumentInterface } from './match-mongo-document.interface';
import { TournamentId } from '../../domain/tournament-id';

@Injectable()
export class MatchRepository {
  constructor(
    @Inject(COLLECTIONS_INSTANCE.MATCHES)
    private readonly matchesCollection: Collection,
  ) {}

  async createMatches(
    tournamentId: TournamentId,
    matches: Match[],
  ): Promise<void> {
    await this.matchesCollection.insertMany(
      matches.map((match) => ({
        tournamentId: new ObjectId(tournamentId.value),
        status: match.status,
        level: match.level,
        index: match.index,
        players: match.players,
        winner: match.winner,
      })),
    );
  }

  async getPlayerMatchFromTournament(
    tournamentId: TournamentId,
    playerName: string,
  ): Promise<MatchWithId | null> {
    const mongoDocument =
      await this.matchesCollection.findOne<MatchMongoDocumentInterface>({
        tournamentId: new ObjectId(tournamentId.value),
        'players.name': playerName,
        status: { $ne: MatchStatus.FINISHED },
      });

    if (mongoDocument === null) {
      return null;
    }

    return MatchMongoDocumentToEntityMapper.fromMongoDocument(mongoDocument);
  }

  async getMatchByTournamentAndLevelAndIndex(
    tournamentId: TournamentId,
    level: number,
    index: number,
  ): Promise<MatchWithId | null> {
    const mongoDocument =
      await this.matchesCollection.findOne<MatchMongoDocumentInterface>({
        tournamentId: new ObjectId(tournamentId.value),
        level,
        index,
      });

    if (mongoDocument === null) {
      return null;
    }

    return MatchMongoDocumentToEntityMapper.fromMongoDocument(mongoDocument);
  }

  async updateMatch(match: MatchWithId): Promise<void> {
    await this.matchesCollection.updateOne(
      {
        _id: new ObjectId(match.matchId.value),
        level: match.level,
        index: match.index,
      },
      {
        $set: {
          status: match.status,
          players: match.players,
          winner: match.winner,
        },
      },
    );
  }
}
