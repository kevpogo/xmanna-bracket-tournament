import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RepositoryModule } from '../../repository/repository.module';
import { SubmitScoreController } from './submit-score.controller';
import { SubmitScoreService } from './submit-score.service';

@Module({
  imports: [RepositoryModule, DatabaseModule],
  controllers: [SubmitScoreController],
  providers: [SubmitScoreService],
})
export class SubmitScoreModule {}
