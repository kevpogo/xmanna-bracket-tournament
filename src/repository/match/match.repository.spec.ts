import { Collection, ObjectId } from 'mongodb';
import { MatchRepository } from './match.repository';
import {
  closeMongoClient,
  createCollection,
  deleteCollection,
} from '../../database/init-mongo-test-db';
import { MatchStatus } from '../../domain/match-status';
import { TournamentId } from '../../domain/tournament-id';
import { MatchWithId } from '../../domain/match.entity';
import { Player } from '../../domain/player.entity';

let matchesCollection: Collection;
let matchRepository: MatchRepository;

beforeEach(async () => {
  matchesCollection = await createCollection('matches');
  matchRepository = new MatchRepository(matchesCollection);
});

afterEach(async () => {
  await deleteCollection(matchesCollection);
});

afterAll(async () => {
  await closeMongoClient();
});

describe('getPlayerMatchFromTournament', () => {
  it('returns a player match from database', async () => {
    const tournamentId = new ObjectId();
    await matchesCollection.insertOne({
      tournamentId: tournamentId,
      players: [
        {
          name: 'aPlayer',
        },
      ],
      index: 0,
      level: 0,
      status: MatchStatus.RUNNING,
    });

    const match = await matchRepository.getPlayerMatchFromTournament(
      new TournamentId(tournamentId.toString()),
      'aPlayer',
    );

    expect(match).toEqual(
      new MatchWithId({
        matchId: expect.anything(),
        level: 0,
        index: 0,
        status: MatchStatus.RUNNING,
        players: [new Player({ name: 'aPlayer' })],
      }),
    );
  });
});

describe('getMatchByTournamentAndLevelAndIndex', () => {
  it('returns a match by tournament and level and index from database', async () => {
    const tournamentId = new ObjectId();
    await matchesCollection.insertOne({
      tournamentId: tournamentId,
      players: [],
      level: 1,
      index: 2,
      status: MatchStatus.RUNNING,
    });

    const match = await matchRepository.getMatchByTournamentAndLevelAndIndex(
      new TournamentId(tournamentId.toString()),
      1,
      2,
    );

    expect(match).toEqual(
      new MatchWithId({
        matchId: expect.anything(),
        level: 1,
        index: 2,
        status: MatchStatus.RUNNING,
        players: [],
      }),
    );
  });
});
