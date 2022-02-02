import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { TournamentRepository } from '../../repository/tournament/tournament.repository';
import { TournamentWithIdWithMatches } from '../../domain/tournament-with-matches.entity';
import { MatchRepository } from '../../repository/match/match.repository';
import { Tournament, TournamentWithId } from '../../domain/tournament.entity';
import { TournamentSize } from '../../domain/tournament-size';

@Injectable()
export class JoinTournamentService {
  constructor(
    private readonly mongoClient: MongoClient,
    private readonly tournamentRepository: TournamentRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  async transactionalRegisterPlayer(
    player: string,
    size: TournamentSize,
  ): Promise<void> {
    const session = this.mongoClient.startSession();
    session.startTransaction();

    try {
      const availableTournament =
        await this.tournamentRepository.getAvailableTournament(size);

      if (availableTournament) {
        await this.updateTournament(availableTournament, player);
      } else {
        await this.createNewTournament(size, player);
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  private async updateTournament(
    availableTournament: TournamentWithId,
    player: string,
  ): Promise<void> {
    availableTournament.addPlayer(player);

    if (availableTournament.isFull()) {
      const tournamentWithMatches =
        TournamentWithIdWithMatches.createFromTournament(availableTournament);

      await this.matchRepository.createMatches(
        tournamentWithMatches.tournament.tournamentId,
        tournamentWithMatches.matches,
      );
      await this.tournamentRepository.updateTournament(
        tournamentWithMatches.tournament,
      );
    } else {
      await this.tournamentRepository.updateTournament(availableTournament);
    }
  }

  private async createNewTournament(
    size: TournamentSize,
    player: string,
  ): Promise<void> {
    const newTournament = Tournament.createWithSize(size);
    newTournament.addPlayer(player);

    await this.tournamentRepository.createTournament(newTournament);
  }
}
