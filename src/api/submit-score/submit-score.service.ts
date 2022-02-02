import { Injectable } from '@nestjs/common';
import { MatchWithId } from '../../domain/match.entity';
import { TournamentId } from '../../domain/tournament-id';
import { MatchRepository } from '../../repository/match/match.repository';
import { Player } from '../../domain/player.entity';
import { TournamentRepository } from '../../repository/tournament/tournament.repository';

@Injectable()
export class SubmitScoreService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly tournamentRepository: TournamentRepository,
  ) {}

  async submitPlayerScore(
    tournamentId: TournamentId,
    match: MatchWithId,
    playerName: string,
    score: number,
  ): Promise<void> {
    match.addPlayerScore(playerName, score);

    if (match.isFinished()) {
      const winner = match.getWinner();
      const nextMatch =
        await this.matchRepository.getMatchByTournamentAndLevelAndIndex(
          tournamentId,
          match.nextLevel(),
          match.nextIndex(),
        );

      if (nextMatch) {
        nextMatch.addPlayer(new Player({ name: winner.name }));
        await this.matchRepository.updateMatch(nextMatch);
      } else {
        await this.tournamentRepository.endTournament(tournamentId);
      }
    }

    await this.matchRepository.updateMatch(match);
  }
}
