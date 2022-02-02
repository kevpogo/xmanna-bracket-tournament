import { Match } from './match.entity';
import { MatchStatus } from './match-status';
import { Player } from './player.entity';

it('changes status in running if match has 2 players', () => {
  const match = Match.create(0, 0);

  match.addPlayer({ name: 'aPlayer' });
  match.addPlayer({ name: 'anotherPlayer' });

  expect(match.status).toEqual(MatchStatus.RUNNING);
});

it('adds player score', () => {
  const match = Match.create(0, 0);
  match.addPlayer({ name: 'aPlayer' });
  match.addPlayer({ name: 'anotherPlayer' });

  match.addPlayerScore('aPlayer', 10);

  expect(match.players).toEqual([
    new Player({ name: 'aPlayer', score: 10 }),
    new Player({ name: 'anotherPlayer' }),
  ]);
});

it('returns true if match is finished', () => {
  const match = Match.create(0, 0);
  match.addPlayer({ name: 'aPlayer' });
  match.addPlayer({ name: 'anotherPlayer' });

  match.addPlayerScore('aPlayer', 10);
  match.addPlayerScore('anotherPlayer', 20);

  expect(match.isFinished()).toEqual(true);
});

it('returns winner of a match', () => {
  const match = Match.create(0, 0);
  match.addPlayer({ name: 'aPlayer' });
  match.addPlayer({ name: 'anotherPlayer' });

  match.addPlayerScore('aPlayer', 10);
  match.addPlayerScore('anotherPlayer', 20);

  expect(match.getWinner()).toEqual(
    new Player({ name: 'anotherPlayer', score: 20 }),
  );
});

it('checks if a player has entered a score', () => {
  const match = Match.create(0, 0);
  match.addPlayer({ name: 'aPlayer' });
  match.addPlayer({ name: 'anotherPlayer' });

  match.addPlayerScore('aPlayer', 10);

  expect(match.hasScoreForPlayer('aPlayer')).toEqual(true);
  expect(match.hasScoreForPlayer('anotherPlayer')).toEqual(false);
});

it('returns next level of a match', () => {
  const match = Match.create(5, 0);

  expect(match.nextLevel()).toEqual(6);
});

it('returns next index of a match', () => {
  const match = Match.create(5, 5);

  expect(match.nextIndex()).toEqual(2);
});
