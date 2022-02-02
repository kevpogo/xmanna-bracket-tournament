import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TournamentResponse } from './response/tournament.response';
import { TournamentStatus } from '../../domain/tournament-status';
import { ToTournamentStatusPipe } from '../../shared/pipes/to-tournament-status.pipe';
import { TournamentWithMatchesRepository } from '../../repository/tournament-with-matches/tournament-with-matches.repository';

@Controller('api/v1/tournaments')
@ApiTags('🏆 API > Tournaments')
export class GetTournamentsController {
  constructor(
    private readonly tournamentWithMatchesRepository: TournamentWithMatchesRepository,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get tournaments',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: TournamentResponse,
    isArray: true,
  })
  @ApiQuery({
    name: 'tournamentStatus',
    required: false,
    type: String,
    enum: TournamentStatus,
    description: 'Optional filter by tournament status',
  })
  async getTournaments(
    @Query('tournamentStatus', ToTournamentStatusPipe)
    tournamentStatus: TournamentStatus,
  ): Promise<readonly TournamentResponse[]> {
    const tournaments =
      await this.tournamentWithMatchesRepository.getTournamentsWithMatchesByStatus(
        tournamentStatus,
      );

    return TournamentResponse.getTournamentsResponse(tournaments);
  }
}
