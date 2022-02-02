import { Module } from '@nestjs/common';
import { JoinTournamentController } from './join-tournament.controller';
import { JoinTournamentService } from './join-tournament.service';
import { PlayerService } from './player.service';
import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../../database/database.module';
import { RepositoryModule } from '../../repository/repository.module';

@Module({
  imports: [RepositoryModule, ConfigModule, DatabaseModule],
  controllers: [JoinTournamentController],
  providers: [JoinTournamentService, PlayerService],
})
export class JoinTournamentModule {}
