import { Collection, ObjectId } from 'mongodb';
import {
  closeMongoClient,
  createCollection,
  deleteCollection,
} from '../../database/init-mongo-test-db';
import { TournamentId } from '../../domain/tournament-id';
import { TournamentWithId } from '../../domain/tournament.entity';
import { TournamentSize } from '../../domain/tournament-size';
import { TournamentStatus } from '../../domain/tournament-status';
import { TournamentWithMatchesRepository } from './tournament-with-matches.repository';
import { TournamentWithIdWithMatches } from '../../domain/tournament-with-matches.entity';
import { MatchWithId } from '../../domain/match.entity';
import { MatchStatus } from '../../domain/match-status';

let tournamentsCollection: Collection;
let matchesCollection: Collection;
let tournamentWithMatchesRepository: TournamentWithMatchesRepository;

beforeEach(async () => {
  tournamentsCollection = await createCollection('tournaments');
  matchesCollection = await createCollection('matches');
  tournamentWithMatchesRepository = new TournamentWithMatchesRepository(
    tournamentsCollection,
    matchesCollection,
  );
});

afterEach(async () => {
  await deleteCollection(tournamentsCollection);
  await deleteCollection(matchesCollection);
});

afterAll(async () => {
  await closeMongoClient();
});

describe('getTournamentsWithMatchesByStatus', () => {
  it('returns pending tournaments with matches', async () => {
    const tournamentId = new ObjectId();
    await tournamentsCollection.insertMany([
      {
        _id: tournamentId,
        size: TournamentSize.SMALL,
        status: TournamentStatus.PENDING,
        players: [],
      },
      {
        size: TournamentSize.SMALL,
        status: TournamentStatus.RUNNING,
        players: [],
      },
    ]);
    await matchesCollection.insertOne({
      tournamentId: tournamentId,
      status: MatchStatus.PENDING,
      level: 0,
      index: 0,
      players: [],
    });

    const availableTournament =
      await tournamentWithMatchesRepository.getTournamentsWithMatchesByStatus(
        TournamentStatus.PENDING,
      );

    expect(availableTournament).toEqual([
      new TournamentWithIdWithMatches({
        tournament: new TournamentWithId({
          tournamentId: new TournamentId(tournamentId.toString()),
          status: TournamentStatus.PENDING,
          players: [],
          size: TournamentSize.SMALL,
        }),
        matches: [
          new MatchWithId({
            matchId: expect.anything(),
            status: MatchStatus.PENDING,
            level: 0,
            index: 0,
            players: [],
          }),
        ],
      }),
    ]);
  });
});
