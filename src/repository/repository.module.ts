import { Module } from '@nestjs/common';
import { TournamentRepository } from './tournament/tournament.repository';
import { DatabaseModule } from '../database/database.module';
import { MatchRepository } from './match/match.repository';
import { TournamentWithMatchesRepository } from './tournament-with-matches/tournament-with-matches.repository';
import { PlayerRepository } from './player/player.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    MatchRepository,
    PlayerRepository,
    TournamentRepository,
    TournamentWithMatchesRepository,
  ],
  exports: [
    MatchRepository,
    PlayerRepository,
    TournamentRepository,
    TournamentWithMatchesRepository,
  ],
})
export class RepositoryModule {}
