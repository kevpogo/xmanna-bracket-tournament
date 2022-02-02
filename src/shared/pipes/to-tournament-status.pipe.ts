import { Injectable, PipeTransform } from '@nestjs/common';
import { TournamentStatus } from '../../domain/tournament-status';

@Injectable()
export class ToTournamentStatusPipe
  implements PipeTransform<string, TournamentStatus | undefined>
{
  transform(tournamentStatus: TournamentStatus): TournamentStatus | undefined {
    if (Object.values(TournamentStatus).includes(tournamentStatus)) {
      return tournamentStatus;
    }
  }
}
