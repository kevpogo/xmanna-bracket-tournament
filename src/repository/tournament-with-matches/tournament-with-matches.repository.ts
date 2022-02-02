import { Inject, Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { COLLECTIONS_INSTANCE } from '../../database/database-collections';
import { TournamentStatus } from '../../domain/tournament-status';
import { TournamentWithMatchesMongoDocumentInterface } from './tournament-with-matches-mongo-document.interface';
import { TournamentWithMatchesMongoDocumentToEntityMapper } from './tournament-with-matches-mongo-document-to-entity.mapper';
import { TournamentWithIdWithMatches } from '../../domain/tournament-with-matches.entity';

@Injectable()
export class TournamentWithMatchesRepository {
  constructor(
    @Inject(COLLECTIONS_INSTANCE.TOURNAMENTS)
    private readonly tournamentsCollection: Collection,
    @Inject(COLLECTIONS_INSTANCE.MATCHES)
    private readonly matchesCollection: Collection,
  ) {}

  async getTournamentsWithMatchesByStatus(
    tournamentStatus: TournamentStatus,
  ): Promise<TournamentWithIdWithMatches[]> {
    const mongoDocument = await this.tournamentsCollection
      .aggregate<TournamentWithMatchesMongoDocumentInterface>([
        {
          $match: {
            status: tournamentStatus ?? { $ne: '' },
          },
        },
        {
          $lookup: {
            from: this.matchesCollection.collectionName,
            localField: '_id',
            foreignField: 'tournamentId',
            as: 'matches',
          },
        },
      ])
      .toArray();

    return mongoDocument.map(
      TournamentWithMatchesMongoDocumentToEntityMapper.fromMongoDocument,
    );
  }
}
