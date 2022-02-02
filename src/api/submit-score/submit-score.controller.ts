import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubmitScoreRequest } from './submit-score.request';
import { TournamentId } from '../../domain/tournament-id';
import { MatchRepository } from '../../repository/match/match.repository';
import { ToTournamentIdPipe } from '../../shared/pipes/to-tournament-id.pipe';
import { SubmitScoreService } from './submit-score.service';
import { MatchStatus } from '../../domain/match-status';

@Controller('api/v1/tournaments/:tournamentId')
@ApiTags('🏆 API > Tournaments')
export class SubmitScoreController {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly submitScoreService: SubmitScoreService,
  ) {}

  @Patch()
  @ApiOperation({
    summary: 'Submit a player score for a match in a tournament',
  })
  @ApiBody({
    required: true,
    type: SubmitScoreRequest,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No match found for this player',
  })
  @ApiParam({
    name: 'tournamentId',
    required: true,
    type: String,
  })
  async submitScore(
    @Param('tournamentId', ToTournamentIdPipe) tournamentId: TournamentId,
    @Body() scoreRequest: SubmitScoreRequest,
  ): Promise<void> {
    const match = await this.matchRepository.getPlayerMatchFromTournament(
      tournamentId,
      scoreRequest.player,
    );

    if (!match) {
      throw new NotFoundException('No tournament found for this player');
    }

    if (match.status === MatchStatus.PENDING) {
      throw new ForbiddenException(
        'The match for this player has not started yet',
      );
    }

    if (match.hasScoreForPlayer(scoreRequest.player)) {
      throw new ForbiddenException('Score for player already send');
    }

    await this.submitScoreService.submitPlayerScore(
      tournamentId,
      match,
      scoreRequest.player,
      scoreRequest.score,
    );
  }
}
