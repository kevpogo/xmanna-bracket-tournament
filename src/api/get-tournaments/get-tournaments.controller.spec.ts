import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { GetTournamentsController } from './get-tournaments.controller';
import * as request from 'supertest';
import { TournamentWithMatchesRepository } from '../../repository/tournament-with-matches/tournament-with-matches.repository';
import { TournamentStatus } from '../../domain/tournament-status';
import { TournamentSize } from '../../domain/tournament-size';
import { TournamentWithIdWithMatches } from '../../domain/tournament-with-matches.entity';
import { MatchWithId } from '../../domain/match.entity';
import { MatchStatus } from '../../domain/match-status';
import { MatchId } from '../../domain/match-id';
import { TournamentWithId } from '../../domain/tournament.entity';
import { TournamentId } from '../../domain/tournament-id';

let app: INestApplication;
let tournamentWithMatchesRepositoryMock: TournamentWithMatchesRepository;

beforeEach(async () => {
  tournamentWithMatchesRepositoryMock = {} as TournamentWithMatchesRepository;
  tournamentWithMatchesRepositoryMock.getTournamentsWithMatchesByStatus =
    jest.fn();

  const testingModule = await Test.createTestingModule({
    controllers: [GetTournamentsController],
    providers: [TournamentWithMatchesRepository],
  })
    .overrideProvider(TournamentWithMatchesRepository)
    .useValue(tournamentWithMatchesRepositoryMock)
    .compile();

  app = testingModule.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.init();
});

it('returns tournaments list', async () => {
  tournamentWithMatchesRepositoryMock.getTournamentsWithMatchesByStatus = jest
    .fn()
    .mockResolvedValue([
      new TournamentWithIdWithMatches({
        tournament: new TournamentWithId({
          tournamentId: new TournamentId('tournamentId'),
          players: ['aPlayer', 'anotherPlayer'],
          size: TournamentSize.SMALL,
          status: TournamentStatus.PENDING,
        }),
        matches: [
          new MatchWithId({
            matchId: new MatchId('matchId'),
            status: MatchStatus.PENDING,
            index: 0,
            level: 0,
            players: [{ name: 'aPlayer' }, { name: 'anotherPlayer' }],
          }),
        ],
      }),
    ]);

  await request(app.getHttpServer())
    .get('/api/v1/tournaments')
    .expect(HttpStatus.OK)
    .expect([
      {
        tournamentId: {
          value: 'tournamentId',
        },
        status: TournamentStatus.PENDING,
        size: TournamentSize.SMALL,
        players: ['aPlayer', 'anotherPlayer'],
        matches: [
          {
            status: MatchStatus.PENDING,
            level: 0,
            index: 0,
            players: [{ name: 'aPlayer' }, { name: 'anotherPlayer' }],
          },
        ],
      },
    ]);
});
