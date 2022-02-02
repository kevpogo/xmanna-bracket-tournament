import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../repository/repository.module';
import { GetTournamentsController } from './get-tournaments.controller';

@Module({
  imports: [RepositoryModule],
  controllers: [GetTournamentsController],
})
export class GetTournamentsModule {}
