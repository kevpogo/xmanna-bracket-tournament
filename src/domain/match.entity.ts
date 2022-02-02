import { MatchStatus } from './match-status';
import { Player } from './player.entity';
import { MatchId } from './match-id';
import { isNumber, sortBy } from 'lodash';

interface MatchConstructorParams {
  status: MatchStatus;
  level: number;
  index: number;
  players: Player[];
  winner?: string;
}

export class Match {
  status: MatchStatus;
  level: number;
  index: number;
  players: Player[];
  winner?: string;

  constructor({
    status,
    level,
    index,
    players,
    winner,
  }: MatchConstructorParams) {
    this.status = status;
    this.level = level;
    this.index = index;
    this.players = players;
    this.winner = winner;
  }

  addPlayer(player: Player): void {
    this.players.push(player);

    if (this.players.length === 2) {
      this.status = MatchStatus.RUNNING;
    }
  }

  addPlayerScore(playerName: string, playerScore: number): void {
    const player = this.players.find(({ name }) => name === playerName);
    if (player) {
      player.score = playerScore;
    }

    if (this.players.every(({ score }) => score !== null)) {
      this.status = MatchStatus.FINISHED;
    }
  }

  isFinished(): boolean {
    return this.status === MatchStatus.FINISHED;
  }

  getWinner(): Player {
    const winner = sortBy(this.players, 'score').reverse()[0];
    this.winner = winner.name;
    return winner;
  }

  hasScoreForPlayer(player: string): boolean {
    return !!this.players.find(
      ({ name, score }) => name === player && isNumber(score),
    );
  }

  nextLevel(): number {
    return this.level + 1;
  }

  nextIndex(): number {
    return Math.floor(this.index / 2);
  }

  static create(level: number, index: number): Match {
    return new Match({
      status: MatchStatus.PENDING,
      level,
      index,
      players: [],
    });
  }
}

interface MatchWithIdConstructorParams extends MatchConstructorParams {
  matchId: MatchId;
}

export class MatchWithId extends Match {
  matchId: MatchId;

  constructor({
    matchId,
    status,
    level,
    index,
    players,
    winner,
  }: MatchWithIdConstructorParams) {
    super({ status, level, index, players, winner });
    this.matchId = matchId;
  }
}
