import { ToTournamentStatusPipe } from './to-tournament-status.pipe';
import { TournamentStatus } from '../../domain/tournament-status';

test('valid', () => {
  const tournamentStatus = 'pending';

  expect(
    new ToTournamentStatusPipe().transform(<TournamentStatus>tournamentStatus),
  ).toEqual(TournamentStatus.PENDING);
});

test('empty', () => {
  const tournamentStatus = '';

  expect(
    new ToTournamentStatusPipe().transform(<TournamentStatus>tournamentStatus),
  ).toEqual(undefined);
});

test('unknown status', () => {
  const tournamentStatus = 'unknownStatus';

  expect(
    new ToTournamentStatusPipe().transform(<TournamentStatus>tournamentStatus),
  ).toEqual(undefined);
});
