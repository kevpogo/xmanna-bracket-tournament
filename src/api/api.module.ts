import { Module } from '@nestjs/common';
import { JoinTournamentModule } from './join-tournament/join-tournament.module';
import { RepositoryModule } from '../repository/repository.module';
import { GetTournamentsModule } from './get-tournaments/get-tournaments.module';
import { SubmitScoreModule } from './submit-score/submit-score.module';

@Module({
  imports: [
    RepositoryModule,
    JoinTournamentModule,
    GetTournamentsModule,
    SubmitScoreModule,
  ],
})
export class ApiModule {}
