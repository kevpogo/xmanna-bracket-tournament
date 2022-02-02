import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MatchRepository } from '../../repository/match/match.repository';
import { SubmitScoreService } from './submit-score.service';
import { SubmitScoreController } from './submit-score.controller';
import { MatchWithId } from '../../domain/match.entity';
import { MatchStatus } from '../../domain/match-status';
import { Player } from '../../domain/player.entity';
import { MatchId } from '../../domain/match-id';

let app: INestApplication;
let matchRepositoryMock: MatchRepository;
let submitScoreServiceMock: SubmitScoreService;

beforeEach(async () => {
  matchRepositoryMock = {} as MatchRepository;
  matchRepositoryMock.getPlayerMatchFromTournament = jest.fn();

  submitScoreServiceMock = {} as SubmitScoreService;
  submitScoreServiceMock.submitPlayerScore = jest.fn();

  const testingModule = await Test.createTestingModule({
    controllers: [SubmitScoreController],
    providers: [MatchRepository, SubmitScoreService],
  })
    .overrideProvider(MatchRepository)
    .useValue(matchRepositoryMock)
    .overrideProvider(SubmitScoreService)
    .useValue(submitScoreServiceMock)
    .compile();

  app = testingModule.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.init();
});

it('throws not found exception when no match exists for given player', async () => {
  matchRepositoryMock.getPlayerMatchFromTournament = jest
    .fn()
    .mockResolvedValue(null);

  await request(app.getHttpServer())
    .patch('/api/v1/tournaments/tournamentId')
    .send({
      player: 'aPlayer',
      score: 100,
    })
    .expect(HttpStatus.NOT_FOUND);
});

it('throw forbidden exception when match for player has not started yet', async () => {
  matchRepositoryMock.getPlayerMatchFromTournament = jest
    .fn()
    .mockResolvedValue(
      new MatchWithId({
        matchId: new MatchId('matchId'),
        status: MatchStatus.PENDING,
        players: [new Player({ name: 'aPlayer' })],
        level: 0,
        index: 0,
      }),
    );

  await request(app.getHttpServer())
    .patch('/api/v1/tournaments/tournamentId')
    .send({
      player: 'aPlayer',
      score: 100,
    })
    .expect(HttpStatus.FORBIDDEN);
});

it('throw forbidden exception when player has already send his score', async () => {
  matchRepositoryMock.getPlayerMatchFromTournament = jest
    .fn()
    .mockResolvedValue(
      new MatchWithId({
        matchId: new MatchId('matchId'),
        status: MatchStatus.RUNNING,
        players: [
          new Player({ name: 'aPlayer', score: 10 }),
          new Player({ name: 'anotherPlayer' }),
        ],
        level: 0,
        index: 0,
      }),
    );

  await request(app.getHttpServer())
    .patch('/api/v1/tournaments/tournamentId')
    .send({
      player: 'aPlayer',
      score: 100,
    })
    .expect(HttpStatus.FORBIDDEN);
});

it('returns 200, everything is ok', async () => {
  matchRepositoryMock.getPlayerMatchFromTournament = jest
    .fn()
    .mockResolvedValue(
      new MatchWithId({
        matchId: new MatchId('matchId'),
        status: MatchStatus.RUNNING,
        players: [
          new Player({ name: 'aPlayer' }),
          new Player({ name: 'anotherPlayer', score: 10 }),
        ],
        level: 0,
        index: 0,
      }),
    );

  await request(app.getHttpServer())
    .patch('/api/v1/tournaments/tournamentId')
    .send({
      player: 'aPlayer',
      score: 100,
    })
    .expect(HttpStatus.OK);
});
