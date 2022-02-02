import { orderBy, range, shuffle } from 'lodash';
import { Match } from './match.entity';
import { TournamentWithId } from './tournament.entity';
import { Player } from './player.entity';

interface TournamentWithIdWithMatchesConstructorParams {
  tournament: TournamentWithId;
  matches: Match[];
}

export class TournamentWithIdWithMatches {
  tournament: TournamentWithId;
  matches: Match[];

  constructor({
    tournament,
    matches,
  }: TournamentWithIdWithMatchesConstructorParams) {
    this.tournament = tournament;
    this.matches = TournamentWithIdWithMatches.orderByLevelAndIndex(matches);
  }

  private static orderByLevelAndIndex(matches: Match[]) {
    return orderBy(matches, ['level', 'index']);
  }

  static createFromTournament(
    tournament: TournamentWithId,
  ): TournamentWithIdWithMatches {
    const shuffledPlayers = shuffle(tournament.players);
    const matches: Match[] = [];

    let numberOfMatchesForActualLevel = tournament.size / 2;
    for (let level = 0; level < tournament.numberOfLevels; level++) {
      range(numberOfMatchesForActualLevel).forEach((index) => {
        const match = Match.create(level, index);
        if (level === 0) {
          match.addPlayer(new Player({ name: shuffledPlayers.shift() || '' }));
          match.addPlayer(new Player({ name: shuffledPlayers.shift() || '' }));
        }
        matches.push(match);
      });
      numberOfMatchesForActualLevel = numberOfMatchesForActualLevel / 2;
    }

    return new TournamentWithIdWithMatches({ tournament, matches });
  }
}
