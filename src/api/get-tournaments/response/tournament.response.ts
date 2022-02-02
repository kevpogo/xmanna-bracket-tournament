import { ApiProperty } from '@nestjs/swagger';
import { TournamentStatus } from '../../../domain/tournament-status';
import { TournamentSize } from '../../../domain/tournament-size';
import { TournamentWithIdWithMatches } from '../../../domain/tournament-with-matches.entity';
import { TournamentMatchResponse } from './tournament-match.response';
import { TournamentId } from '../../../domain/tournament-id';

export class TournamentResponse {
  @ApiProperty()
  tournamentId: TournamentId;

  @ApiProperty({
    enum: TournamentStatus,
  })
  status: TournamentStatus;

  @ApiProperty({
    description: 'Maximum number of participants',
    enum: Object.values(TournamentSize).filter((k) => Number(k)),
  })
  size: TournamentSize;

  @ApiProperty()
  players: string[];

  @ApiProperty()
  matches: TournamentMatchResponse[];

  constructor(
    tournamentId: TournamentId,
    status: TournamentStatus,
    size: TournamentSize,
    players: string[],
    matches: TournamentMatchResponse[],
  ) {
    this.tournamentId = tournamentId;
    this.status = status;
    this.size = size;
    this.players = players;
    this.matches = matches;
  }

  static getTournamentsResponse(
    tournaments: TournamentWithIdWithMatches[],
  ): TournamentResponse[] {
    return tournaments.map(({ tournament, matches }) => {
      const matchesResponse =
        TournamentMatchResponse.getMatchesResponse(matches);

      return new TournamentResponse(
        tournament.tournamentId,
        tournament.status,
        tournament.size,
        tournament.players,
        matchesResponse,
      );
    });
  }
}
