import { Injectable, PipeTransform } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { TournamentId } from '../../domain/tournament-id';

@Injectable()
export class ToTournamentIdPipe
  implements PipeTransform<string, TournamentId | null>
{
  transform(value: string | undefined | null): TournamentId | null {
    if (value === null || value === undefined || isEmpty(value)) {
      return null;
    }
    return new TournamentId(value);
  }
}
