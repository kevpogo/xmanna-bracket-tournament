import { TournamentWithId } from './tournament.entity';
import { Match } from './match.entity';
import { TournamentWithIdWithMatches } from './tournament-with-matches.entity';
import { TournamentStatus } from './tournament-status';
import { TournamentSize } from './tournament-size';
import { TournamentId } from './tournament-id';
import { range } from 'lodash';
import { MatchStatus } from './match-status';

it('orders matches by level and index when we create instance', () => {
  const tournament = new TournamentWithId({
    tournamentId: new TournamentId('tournamentId'),
    status: TournamentStatus.PENDING,
    size: TournamentSize.SMALL,
    players: [],
  });
  const matches = [Match.create(1, 0), Match.create(0, 2), Match.create(1, 1)];

  const tournamentWithMatches = new TournamentWithIdWithMatches({
    tournament,
    matches,
  });

  expect(tournamentWithMatches.matches).toEqual([
    Match.create(0, 2),
    Match.create(1, 0),
    Match.create(1, 1),
  ]);
});

it('creates matches with players in first level', () => {
  const tournament = new TournamentWithId({
    tournamentId: new TournamentId('tournamentId'),
    status: TournamentStatus.PENDING,
    size: TournamentSize.SMALL,
    players: range(TournamentSize.SMALL).map((n) => `player${n}`),
  });

  const tournamentWithMatches =
    TournamentWithIdWithMatches.createFromTournament(tournament);

  expect(tournamentWithMatches.matches).toEqual([
    new Match({
      status: MatchStatus.RUNNING,
      level: 0,
      index: 0,
      players: [expect.anything(), expect.anything()],
    }),
    new Match({
      status: MatchStatus.RUNNING,
      level: 0,
      index: 1,
      players: [expect.anything(), expect.anything()],
    }),
    new Match({
      status: MatchStatus.RUNNING,
      level: 0,
      index: 2,
      players: [expect.anything(), expect.anything()],
    }),
    new Match({
      status: MatchStatus.RUNNING,
      level: 0,
      index: 3,
      players: [expect.anything(), expect.anything()],
    }),
    new Match({
      status: MatchStatus.PENDING,
      level: 1,
      index: 0,
      players: [],
    }),
    new Match({
      status: MatchStatus.PENDING,
      level: 1,
      index: 1,
      players: [],
    }),
    new Match({
      status: MatchStatus.PENDING,
      level: 2,
      index: 0,
      players: [],
    }),
  ]);
});
