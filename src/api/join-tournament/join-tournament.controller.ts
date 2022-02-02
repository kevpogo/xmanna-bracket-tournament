import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoinTournamentRequest } from './join-tournament.request';
import { PlayerService } from './player.service';
import { JoinTournamentService } from './join-tournament.service';

@Controller('api/v1/tournaments')
@ApiTags('🏆 API > Tournaments')
export class JoinTournamentController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly joinTournamentService: JoinTournamentService,
  ) {}

  @Post('join')
  @ApiOperation({
    summary: 'Join a tournament',
  })
  @ApiBody({
    required: true,
    type: JoinTournamentRequest,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Player already registered in a tournament',
  })
  async joinTournament(
    @Body() joinTournamentRequest: JoinTournamentRequest,
  ): Promise<void> {
    const canPlayerRegister = await this.playerService.canPlayerRegister(
      joinTournamentRequest.player,
    );

    if (!canPlayerRegister) {
      throw new ConflictException(
        'Player is already register to a tournament.',
      );
    }

    await this.joinTournamentService.transactionalRegisterPlayer(
      joinTournamentRequest.player,
      joinTournamentRequest.size,
    );
  }
}
