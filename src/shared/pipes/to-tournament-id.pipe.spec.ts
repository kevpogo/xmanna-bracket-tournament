import { TournamentId } from '../../domain/tournament-id';
import { ToTournamentIdPipe } from './to-tournament-id.pipe';

test('valid', () => {
  const tournamentId = 'aTournamentId';

  expect(new ToTournamentIdPipe().transform(tournamentId)).toEqual(
    new TournamentId('aTournamentId'),
  );
});

test('empty', () => {
  const tournamentId = '';

  expect(new ToTournamentIdPipe().transform(tournamentId)).toEqual(null);
});

test('null', () => {
  const tournamentId = null;

  expect(new ToTournamentIdPipe().transform(tournamentId)).toEqual(null);
});

test('undefined', () => {
  const tournamentId = undefined;

  expect(new ToTournamentIdPipe().transform(tournamentId)).toEqual(null);
});
