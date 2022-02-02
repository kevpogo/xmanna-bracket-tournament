import { Tournament } from './tournament.entity';
import { TournamentSize } from './tournament-size';
import { TournamentStatus } from './tournament-status';
import { range } from 'lodash';

it('adds a player to a tournament', () => {
  const tournament = Tournament.createWithSize(TournamentSize.SMALL);

  tournament.addPlayer('aPlayer');

  expect(tournament.players).toEqual(['aPlayer']);
});

it("don't add player if tournament is running", () => {
  const tournament = new Tournament({
    size: TournamentSize.SMALL,
    status: TournamentStatus.RUNNING,
    players: [],
  });

  tournament.addPlayer('aPlayer');

  expect(tournament.players).toEqual([]);
});

it('changes status of tournament if limit of players have been reached', () => {
  const tournament = Tournament.createWithSize(TournamentSize.SMALL);
  range(TournamentSize.SMALL).forEach((i) =>
    tournament.addPlayer(`player${i}`),
  );

  tournament.addPlayer(`anotherPlayer`);

  expect(tournament.players.length).toEqual(TournamentSize.SMALL);
  expect(tournament.status).toEqual(TournamentStatus.RUNNING);
});

it('gets the number of levels of a small tournament', () => {
  const tournament = Tournament.createWithSize(TournamentSize.SMALL);

  expect(tournament.numberOfLevels).toEqual(3);
});
