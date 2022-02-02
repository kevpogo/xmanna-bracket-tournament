import { TournamentSize } from './tournament-size';
import { TournamentStatus } from './tournament-status';
import { TournamentId } from './tournament-id';

interface TournamentConstructorParams {
  size: TournamentSize;
  status: TournamentStatus;
  players: string[];
}

export class Tournament {
  size: TournamentSize;
  status: TournamentStatus;
  players: string[];

  constructor({ size, status, players }: TournamentConstructorParams) {
    this.size = size;
    this.status = status;
    this.players = players;
  }

  addPlayer(name: string): void {
    if (this.status !== TournamentStatus.PENDING) {
      return;
    }

    this.players.push(name);
    if (this.isFull()) {
      this.status = TournamentStatus.RUNNING;
    }
  }

  isFull(): boolean {
    return this.size === this.players.length;
  }

  get numberOfLevels(): number {
    return Math.log2(this.size);
  }

  static createWithSize(size: TournamentSize): Tournament {
    return new Tournament({
      size,
      status: TournamentStatus.PENDING,
      players: [],
    });
  }
}

interface TournamentWithIdConstructorParams
  extends TournamentConstructorParams {
  tournamentId: TournamentId;
}

export class TournamentWithId extends Tournament {
  tournamentId: TournamentId;

  constructor({
    tournamentId,
    size,
    status,
    players,
  }: TournamentWithIdConstructorParams) {
    super({ size, status, players });
    this.tournamentId = tournamentId;
  }
}
