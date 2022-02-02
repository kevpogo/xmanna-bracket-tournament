import { Collection, ObjectId } from 'mongodb';
import {
  closeMongoClient,
  createCollection,
  deleteCollection,
} from '../../database/init-mongo-test-db';
import { TournamentId } from '../../domain/tournament-id';
import { TournamentRepository } from './tournament.repository';
import { Tournament, TournamentWithId } from '../../domain/tournament.entity';
import { TournamentSize } from '../../domain/tournament-size';
import { TournamentStatus } from '../../domain/tournament-status';

let tournamentsCollection: Collection;
let tournamentRepository: TournamentRepository;

beforeEach(async () => {
  tournamentsCollection = await createCollection('tournaments');
  tournamentRepository = new TournamentRepository(tournamentsCollection);
});

afterEach(async () => {
  await deleteCollection(tournamentsCollection);
});

afterAll(async () => {
  await closeMongoClient();
});

describe('getAvailableTournament', () => {
  it('returns a pending tournament', async () => {
    const tournamentId = new ObjectId();
    await tournamentsCollection.insertOne({
      _id: tournamentId,
      size: TournamentSize.SMALL,
      status: TournamentStatus.PENDING,
      players: [],
    });

    const availableTournament = await tournamentRepository.getAvailableTournament(
      TournamentSize.SMALL,
    );

    expect(availableTournament).toEqual(
      new TournamentWithId({
        tournamentId: new TournamentId(tournamentId.toString()),
        size: TournamentSize.SMALL,
        status: TournamentStatus.PENDING,
        players: [],
      }),
    );
  });
});
