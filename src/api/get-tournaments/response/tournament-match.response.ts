import { ApiProperty } from '@nestjs/swagger';
import { TournamentPlayerResponse } from './tournament-player.response';
import { Match } from '../../../domain/match.entity';
import { MatchStatus } from '../../../domain/match-status';

export class TournamentMatchResponse {
  @ApiProperty()
  status: MatchStatus;

  @ApiProperty()
  players: TournamentPlayerResponse[];

  @ApiProperty()
  level: number;

  @ApiProperty()
  index: number;

  @ApiProperty()
  winner?: string;

  constructor(
    status: MatchStatus,
    level: number,
    index: number,
    players: TournamentPlayerResponse[],
    winner?: string,
  ) {
    this.status = status;
    this.level = level;
    this.index = index;
    this.players = players;
    this.winner = winner;
  }

  static getMatchesResponse(matches: Match[]): TournamentMatchResponse[] {
    return matches.map(({ status, players, level, index, winner }) => {
      const playersResponse =
        TournamentPlayerResponse.getPlayersResponse(players);
      return new TournamentMatchResponse(
        status,
        level,
        index,
        playersResponse,
        winner,
      );
    });
  }
}
