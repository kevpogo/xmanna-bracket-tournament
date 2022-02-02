import { Inject, Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { COLLECTIONS_INSTANCE } from '../../database/database-collections';
import { TournamentStatus } from '../../domain/tournament-status';
import { MatchStatus } from '../../domain/match-status';

@Injectable()
export class PlayerRepository {
  constructor(
    @Inject(COLLECTIONS_INSTANCE.TOURNAMENTS)
    private readonly tournamentsCollection: Collection,
    @Inject(COLLECTIONS_INSTANCE.MATCHES)
    private readonly matchesCollection: Collection,
  ) {}

  async isPlayerAlreadyRegistered(player: string): Promise<boolean> {
    const [numberOfPendingTournament, numberOfPendingMatches] =
      await Promise.all([
        this.tournamentsCollection.countDocuments({
          players: player,
          status: TournamentStatus.PENDING,
        }),
        this.matchesCollection.countDocuments({
          'players.player': player,
          status: MatchStatus.PENDING,
        }),
      ]);

    return numberOfPendingTournament !== 0 || numberOfPendingMatches !== 0;
  }
}
