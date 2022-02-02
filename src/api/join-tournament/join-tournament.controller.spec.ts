import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
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
import { PlayerService } from './player.service';
import { JoinTournamentService } from './join-tournament.service';
import { JoinTournamentController } from './join-tournament.controller';

let app: INestApplication;
let playerServiceMock: PlayerService;
let joinTournamentServiceMock: JoinTournamentService;

beforeEach(async () => {
  playerServiceMock = {} as PlayerService;
  playerServiceMock.canPlayerRegister = jest.fn();

  joinTournamentServiceMock = {} as JoinTournamentService;
  joinTournamentServiceMock.transactionalRegisterPlayer = jest.fn();

  const testingModule = await Test.createTestingModule({
    controllers: [JoinTournamentController],
    providers: [PlayerService, JoinTournamentService],
  })
    .overrideProvider(PlayerService)
    .useValue(playerServiceMock)
    .overrideProvider(JoinTournamentService)
    .useValue(joinTournamentServiceMock)
    .compile();

  app = testingModule.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.init();
});

it('returns 409 because player is already registered to a tournament', async () => {
  playerServiceMock.canPlayerRegister = jest.fn().mockResolvedValue(false);

  await request(app.getHttpServer())
    .post('/api/v1/tournaments/join')
    .send({
      player: 'aPlayer',
      size: TournamentSize.SMALL,
    })
    .expect(HttpStatus.CONFLICT);
});

it('returns 200, everything is ok', async () => {
  playerServiceMock.canPlayerRegister = jest.fn().mockResolvedValue(true);

  await request(app.getHttpServer())
    .post('/api/v1/tournaments/join')
    .send({
      player: 'aPlayer',
      size: TournamentSize.SMALL,
    })
    .expect(HttpStatus.OK);
});
