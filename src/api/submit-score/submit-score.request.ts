import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubmitScoreRequest {
  @ApiProperty()
  @IsNotEmpty()
  player: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  score: number;

  constructor(player: string, score: number) {
    this.player = player;
    this.score = score;
  }
}
