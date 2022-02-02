import { ApiProperty } from '@nestjs/swagger';
import { Player } from '../../../domain/player.entity';

export class TournamentPlayerResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  score?: number;

  constructor(name: string, score?: number) {
    this.name = name;
    this.score = score;
  }

  static getPlayersResponse(players: Player[]): TournamentPlayerResponse[] {
    return players.map(
      ({ name, score }) => new TournamentPlayerResponse(name, score),
    );
  }
}
