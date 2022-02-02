import { Inject, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { COLLECTIONS_INSTANCE } from '../../database/database-collections';
import { TournamentSize } from '../../domain/tournament-size';
import { Tournament, TournamentWithId } from '../../domain/tournament.entity';
import { TournamentMongoDocumentInterface } from './tournament-mongo-document.interface';
import { TournamentStatus } from '../../domain/tournament-status';
import { TournamentMongoDocumentToEntityMapper } from './tournament-mongo-document-to-entity.mapper';
import { TournamentId } from '../../domain/tournament-id';

@Injectable()
export class TournamentRepository {
  constructor(
    @Inject(COLLECTIONS_INSTANCE.TOURNAMENTS)
    private readonly tournamentsCollection: Collection,
  ) {}

  async createTournament(tournament: Tournament): Promise<void> {
    await this.tournamentsCollection.insertOne({
      size: tournament.size,
      status: tournament.status,
      players: tournament.players,
    });
  }

  async getAvailableTournament(
    size: TournamentSize,
  ): Promise<TournamentWithId | null> {
    const mongoDocument =
      await this.tournamentsCollection.findOne<TournamentMongoDocumentInterface>(
        {
          size,
          status: TournamentStatus.PENDING,
        },
      );

    if (!mongoDocument) {
      return null;
    }

    return TournamentMongoDocumentToEntityMapper.fromMongoDocument(
      mongoDocument,
    );
  }

  async updateTournament(tournament: TournamentWithId): Promise<void> {
    await this.tournamentsCollection.updateOne(
      {
        _id: new ObjectId(tournament.tournamentId.value),
      },
      {
        $set: {
          status: tournament.status,
          players: tournament.players,
        },
      },
    );
  }

  async endTournament(tournamentId: TournamentId): Promise<void> {
    await this.tournamentsCollection.updateOne(
      {
        _id: new ObjectId(tournamentId.value),
      },
      {
        $set: {
          status: TournamentStatus.FINISHED,
        },
      },
    );
  }
}
