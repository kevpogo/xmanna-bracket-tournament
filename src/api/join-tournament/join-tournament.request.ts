import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TournamentSize } from '../../domain/tournament-size';

export class JoinTournamentRequest {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  player: string;

  @ApiProperty({
    enum: Object.values(TournamentSize).filter((k) => Number(k)),
    required: true,
  })
  @IsEnum(TournamentSize)
  @IsNotEmpty()
  size: TournamentSize;

  constructor(player: string, size: TournamentSize) {
    this.player = player;
    this.size = size;
  }
}
